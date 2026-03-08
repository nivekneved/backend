const supabase = require('../config/supabase');
const { formatItinerary } = require('../utils/itineraryHelper');
const Joi = require('joi');

const serviceSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null).optional(),
    category: Joi.string().required(),
    pricing: Joi.object({
        basePrice: Joi.number().min(0).optional(),
        currency: Joi.string().optional(),
        adult: Joi.number().min(0).optional(),
        child: Joi.number().min(0).optional(),
        infant: Joi.number().min(0).optional()
    }).unknown(true).optional(),
    location: Joi.string().allow('', null).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    inventory: Joi.object().unknown(true).optional(),
    itinerary: Joi.array().items(Joi.object().unknown(true)).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    inclusions: Joi.array().items(Joi.string()).optional(),
    exclusions: Joi.array().items(Joi.string()).optional(),
    highlights: Joi.array().items(Joi.string()).optional(),
    is_featured: Joi.boolean().optional(),
    draft: Joi.boolean().optional(),
    price: Joi.number().optional()
}).unknown(true);

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, checkIn, checkOut, featured, page = 1, limit = 10 } = req.query;

        // 1. Build Base Query
        let query = supabase.from('services').select('id, name, pricing, category, location, images, is_featured, created_at', { count: 'exact' });

        if (category) query = query.eq('category', category);
        if (featured === 'true' || featured === true) query = query.eq('is_featured', true);
        if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        if (minPrice) query = query.gte('price', Number(minPrice));
        if (maxPrice) query = query.lte('price', Number(maxPrice));

        // 2. Fetch Initial Data (Pagination handled after availability if checkIn/Out present, else now)
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to).order('created_at', { ascending: false });

        const { data, error, count } = await query;
        if (error) throw error;

        // 3. Handle Availability Filtering (Complex Logic Extracted)
        if (checkIn && checkOut && data.length > 0) {
            const filteredData = await getAvailableServices(data, checkIn, checkOut);
            return res.json({
                services: filteredData,
                total: count, // Note: Total count is relative to initial filter
                page: Number(page),
                pages: Math.ceil(count / limit)
            });
        }

        res.json({
            services: data,
            total: count || 0,
            page: Number(page),
            pages: Math.ceil((count || 0) / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Helper: Filters services based on room availability for specific dates
 * Adheres to '1 function 1 task' principle by isolating inventory logic.
 */
async function getAvailableServices(services, checkIn, checkOut) {
    const serviceIds = services.map(s => s.id);
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const requiredNights = Math.max(1, Math.round(Math.abs((end - start) / (24 * 60 * 60 * 1000))));

    // Fetch rooms
    const { data: rooms } = await supabase
        .from('hotel_rooms')
        .select('id, service_id, total_units')
        .in('service_id', serviceIds);

    if (!rooms || rooms.length === 0) return [];

    // Fetch daily price/availability records
    const { data: dailyPrices } = await supabase
        .from('room_daily_prices')
        .select('room_id, date, is_blocked, available_units')
        .in('room_id', rooms.map(r => r.id))
        .gte('date', checkIn)
        .lt('date', checkOut);

    const pricesMap = {};
    dailyPrices?.forEach(dp => {
        if (!pricesMap[dp.room_id]) pricesMap[dp.room_id] = [];
        pricesMap[dp.room_id].push(dp);
    });

    return services.filter(service => {
        const serviceRooms = rooms.filter(r => r.service_id === service.id);
        return serviceRooms.some(room => {
            const roomPrices = pricesMap[room.id] || [];
            if (roomPrices.length < requiredNights) return false;
            return roomPrices.every(dp => !dp.is_blocked && (dp.available_units === undefined || dp.available_units > 0));
        });
    });
}

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: service, error } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Fetch rooms and daily prices for the web app to calculate totals
        const { data: rooms } = await supabase
            .from('hotel_rooms')
            .select('*')
            .eq('service_id', id);

        let roomData = [];
        if (rooms && rooms.length > 0) {
            const roomIds = rooms.map(r => r.id);
            const { data: dailyPrices } = await supabase
                .from('room_daily_prices')
                .select('*')
                .in('room_id', roomIds);

            roomData = rooms.map(room => ({
                ...room,
                dailyPrices: dailyPrices?.filter(dp => dp.room_id === room.id) || []
            }));
        }

        res.json({ ...service, rooms: roomData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res) => {
    try {
        const { error: validationError } = serviceSchema.validate(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError.details[0].message });
        }

        const serviceData = { ...req.body };
        if (serviceData.itinerary) {
            serviceData.itinerary = formatItinerary(serviceData.itinerary);
        }

        const { data, error } = await supabase
            .from('services')
            .insert([serviceData])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res) => {
    try {
        const { error: validationError } = serviceSchema.validate(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError.details[0].message });
        }

        const { id } = req.params;
        const { data: oldProduct } = await supabase.from('services').select('pricing').eq('id', id).single();

        const updates = { ...req.body };
        if (updates.itinerary) {
            updates.itinerary = formatItinerary(updates.itinerary);
        }

        const { data, error } = await supabase
            .from('services')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) return res.status(404).json({ message: 'Service not found' });

        // Scenario 099: Price Drop Detection
        const oldPrice = oldProduct?.pricing?.basePrice;
        const newPrice = data.pricing?.basePrice;
        if (oldPrice && newPrice && newPrice < oldPrice * 0.9) {
            // Emit a 'price_drop' event or just confirm it happened
            // console.log(`PRICE DROP DETECTED for ${data.name}: ${oldPrice} -> ${newPrice}`);
        }

        // Audit Log
        await supabase.from('audit_logs').insert([{
            admin_id: req.admin?.id,
            action: 'UPDATE_SERVICE',
            target_type: 'SERVICE',
            target_id: id,
            details: { oldPrice, newPrice, changes: req.body }
        }]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get service inventory (rooms and daily prices)
// @route   GET /api/services/:id/inventory
// @access  Private/Admin
exports.getInventory = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Fetch rooms for this service
        const { data: rooms, error: roomsError } = await supabase
            .from('hotel_rooms')
            .select('*')
            .eq('service_id', id);

        if (roomsError) throw roomsError;

        // 2. Fetch daily prices/blocks for these rooms
        const roomIds = rooms.map(r => r.id);
        const { data: dailyPrices, error: pricesError } = await supabase
            .from('room_daily_prices')
            .select('*')
            .in('room_id', roomIds);

        if (pricesError) throw pricesError;

        // Scenario 095: Calculate Occupancy/Thresholds
        const enhancedRooms = rooms.map(room => {
            const roomPrices = dailyPrices.filter(dp => dp.room_id === room.id);
            const totalPossible = roomPrices.length * (room.total_units || 1);
            const booked = roomPrices.reduce((sum, dp) => sum + ((room.total_units || 1) - (dp.available_units ?? (dp.is_blocked ? 0 : (room.total_units || 1)))), 0);
            return {
                ...room,
                occupancyRate: totalPossible > 0 ? Math.round((booked / totalPossible) * 100) : 0
            };
        });

        res.json({ rooms: enhancedRooms, dailyPrices });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get rooms for a service
// @route   GET /api/services/:id/rooms
// @access  Private/Admin
exports.getRooms = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: rooms, error } = await supabase
            .from('hotel_rooms')
            .select('*')
            .eq('service_id', id);

        if (error) throw error;
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Bulk update room inventory status and price
// @route   POST /api/services/:id/inventory/bulk
// @access  Private/Admin
exports.bulkUpdateInventory = async (req, res) => {
    try {
        const { room_id, startDate, endDate, price, multiplier, is_blocked, applyToDays } = req.body;

        const start = new Date(startDate);
        const end = new Date(endDate);
        const updates = [];

        // If multiplier is used, we might need existing prices. 
        // For simplicity in this "impressive" scenario, we'll assume the multiplier applies to the ROOM's base price if provided, 
        // or we use the fixed price.

        let finalPrice = Number(price);

        if (multiplier) {
            // Fetch room to get its default base price if needed
            const { data: room } = await supabase.from('hotel_rooms').select('price_per_night').eq('id', room_id).single();
            if (room) {
                finalPrice = Math.round(room.price_per_night * (1 + Number(multiplier) / 100));
            }
        }

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const dayOfWeek = d.getDay();
            if (applyToDays && applyToDays.length > 0) {
                if (!applyToDays.includes(dayOfWeek)) continue;
            }

            const dateStr = d.toISOString().split('T')[0];
            updates.push({
                room_id,
                date: dateStr,
                price: finalPrice,
                is_blocked: !!is_blocked
            });
        }

        if (updates.length > 0) {
            // Fetch room for default units
            const { data: room } = await supabase.from('hotel_rooms').select('total_units').eq('id', room_id).single();
            const finalUpdates = updates.map(u => ({
                ...u,
                available_units: u.is_blocked ? 0 : (room?.total_units || 1)
            }));

            const { error } = await supabase
                .from('room_daily_prices')
                .upsert(finalUpdates, { onConflict: 'room_id,date' });

            if (error) throw error;

            // Audit Log
            await supabase.from('audit_logs').insert([{
                admin_id: req.admin?.id,
                action: 'BULK_UPDATE_INVENTORY',
                target_type: 'SERVICE',
                target_id: req.params.id,
                details: { room_id, startDate, endDate, finalPrice }
            }]);
        }

        res.json({ success: true, count: updates.length, price: finalPrice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Batch update specific room prices
// @route   POST /api/services/:id/inventory/batch
// @access  Private/Admin
exports.batchUpdatePrices = async (req, res) => {
    try {
        const { room_id, updates } = req.body; // updates: [{ date, price, is_blocked }]

        if (!updates || updates.length === 0) {
            return res.json({ success: true, count: 0 });
        }

        const formattedUpdates = updates.map(u => ({
            room_id,
            date: u.date,
            price: Number(u.price),
            is_blocked: !!u.is_blocked
        }));

        const { error } = await supabase
            .from('room_daily_prices')
            .upsert(formattedUpdates, { onConflict: 'room_id,date' });

        if (error) throw error;

        res.json({ success: true, count: formattedUpdates.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update room block status
// @route   POST /api/services/:id/inventory/block
// @access  Private/Admin
exports.updateInventoryBlock = async (req, res) => {
    try {
        const { room_id, date, is_blocked, price } = req.body;

        const { error } = await supabase
            .from('room_daily_prices')
            .upsert([{ room_id, date, is_blocked, price }], { onConflict: 'room_id,date' });

        if (error) throw error;

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;

        // First, check if the product exists
        const { data: existingProduct, error: fetchError } = await supabase
            .from('services')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !existingProduct) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Delete the product
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Audit Log
        await supabase.from('audit_logs').insert([{
            admin_id: req.admin?.id,
            action: 'DELETE_SERVICE',
            target_type: 'SERVICE',
            target_id: id,
            details: { productName: existingProduct.name }
        }]);

        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
