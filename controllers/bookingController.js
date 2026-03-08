const supabase = require('../config/supabase');
const notificationService = require('../utils/notificationService');
const Joi = require('joi');

const bookingSchema = Joi.object({
    customer_info: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required()
    }).required(),
    service_id: Joi.string().allow(null, '').optional(),
    service_type: Joi.string().required(),
    room_id: Joi.string().allow(null, '').optional(),
    booking_details: Joi.object({
        checkIn: Joi.date().iso().required(),
        checkOut: Joi.date().iso().min(Joi.ref('checkIn')).required(),
        travelers: Joi.number().integer().min(1).default(1),
        message: Joi.string().allow('', null).optional(),
        productName: Joi.string().allow('', null).optional(),
        estimatedTotal: Joi.alternatives().try(Joi.string(), Joi.number()).optional()
    }).required(),
    consent: Joi.boolean().valid(true).required(),
    estimated_total: Joi.number().optional()
});

// @desc    Create a booking request
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res) => {
    try {
        const { error: validationError } = bookingSchema.validate(req.body);
        if (validationError) return res.status(400).json({ message: validationError.details[0].message });

        const { customer_info, service_id, service_type, room_id, booking_details, consent, estimated_total } = req.body;
        if (!consent) return res.status(400).json({ message: 'Consent is required' });

        // 1. Determine Price & Update Inventory (Atomic)
        const finalPrice = await resolveBookingPrice(req.body);

        // Anti-manipulation check
        if (estimated_total !== undefined && finalPrice > 0 && Math.abs(finalPrice - estimated_total) > 100) {
            return res.status(400).json({ message: 'Price mismatch detected. Please refresh.' });
        }

        // 2. Create Record
        const { data: booking, error: bookError } = await supabase
            .from('bookings')
            .insert([{ customer_info, service_id, service_type, booking_details, total_price: finalPrice, consent, status: 'pending', user_id: req.user.id }])
            .select('*')
            .single();

        if (bookError) throw bookError;

        // 3. Trigger Notifications (Async)
        triggerBookingNotifications(booking, customer_info);

        res.status(201).json({ ...booking, finalPrice });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Helper: Logic to determine pricing and perform atomic inventory locks
 */
async function resolveBookingPrice(payload) {
    const { room_id, service_id, booking_details, estimated_total } = payload;
    const { checkIn, checkOut } = booking_details || {};

    if (room_id) {
        const { data: invUpdate } = await supabase.rpc('decrement_room_inventory', { p_room_id: room_id, p_check_in: checkIn, p_check_out: checkOut });
        if (!invUpdate?.success) throw new Error(invUpdate?.message || 'Dates unavailable');
        return invUpdate.total_price || 0;
    }

    if (service_id && service_id !== 'static-inquiry') {
        const { data: service } = await supabase.from('services').select('pricing').eq('id', service_id).single();
        const basePrice = service?.pricing?.price || service?.pricing?.base_price || service?.pricing?.adult || 0;
        const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 86400)) || 1);
        return basePrice * nights;
    }

    return estimated_total || 0;
}

/**
 * Helper: Decoupled notification triggers
 */
async function triggerBookingNotifications(booking, customer_info) {
    try {
        const customerEmail = customer_info?.email;
        const productName = booking.booking_details?.productName || 'Service';
        if (customerEmail) {
            await notificationService.sendEmail(customerEmail, 'Paradise Confirmed!', `Total: ${booking.total_price} MUR.`);
        }
        await notificationService.sendEmail('admin@travellounge.mu', 'INCOME ALERT', `New booking for ${productName}`);
    } catch (e) {
        console.error('Notification failed', e);
    }
}

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
exports.getBookings = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('*, services(name, type)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, admin_notes } = req.body;
        const { data, error } = await supabase
            .from('bookings')
            .update({ status, admin_notes })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Audit Log
        await supabase.from('audit_logs').insert([{
            admin_id: req.admin?.id,
            action: 'UPDATE_BOOKING_STATUS',
            target_type: 'BOOKING',
            target_id: req.params.id,
            details: { newStatus: status, admin_notes }
        }]);

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a custom package request (Package Builder)
// @route   POST /api/bookings/package-request
// @access  Public
exports.createPackageRequest = async (req, res) => {
    try {
        const { customer, package_details, consent } = req.body;

        if (!consent) return res.status(400).json({ message: 'Consent is required' });

        const { data, error } = await supabase
            .from('bookings')
            .insert([{
                customer,
                booking_details: package_details,
                status: 'pending',
                total_price: 0, // Quote to be provided
                consent,
                is_custom: true,
                user_id: req.user.id // Link to authenticated user
            }])
            .select('*')
            .single();

        if (error) throw error;

        // Notifications
        try {
            await notificationService.sendEmail(customer.email, 'Bespoke Package Request Received!', 'Our agents will review your vision and contact you with a tailormade quote.');
            await notificationService.sendEmail('admin@travellounge.mu', 'NEW PACKAGE BUILDER REQUEST', `Customer ${customer.name} wants a custom ${package_details.duration} trip to ${package_details.destination}. Please review and provide a quote.`);
        } catch (e) {
            console.error('Notification failed', e);
        }

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Trigger email notification (without creating booking)
// @route   POST /api/bookings/notify
// @access  Private/Admin
exports.notifyBooking = async (req, res) => {
    try {
        const { booking_id, customer, productName, totalPrice } = req.body;

        // Notifications
        try {
            await notificationService.sendEmail(customer.email, 'Paradise Confirmed!', `Total: ${totalPrice} MUR. Property: ${productName}`);
            await notificationService.sendEmail('admin@travellounge.mu', 'INCOME ALERT: Booking Notification', `Manual notification triggered for Reservation #${booking_id} (${productName}). Value: ${totalPrice} MUR`);
            res.json({ success: true, message: 'Notifications sent' });
        } catch (e) {
            console.error('Notification failed', e);
            res.status(500).json({ message: 'Notification failed' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
