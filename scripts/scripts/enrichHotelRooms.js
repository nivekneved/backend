const supabase = require('../backend/config/supabase');

const roomEnrichment = {
    'LUX* Belle Mare': [
        {
            name: 'Deluxe Room',
            type: 'room',
            size: '45 m²',
            bed: 'King Bed',
            view: 'Garden View',
            price_per_night: 12000,
            max_occupancy: 2,
            features: {
                amenities: ['Free WiFi', 'Mini Bar', 'Air Conditioning', 'Safe'],
                weekend_price: 15000
            }
        },
        {
            name: 'Junior Suite',
            type: 'suite',
            size: '60 m²',
            bed: 'King Size Bed',
            view: 'Sea View',
            price_per_night: 18000,
            max_occupancy: 3,
            features: {
                amenities: ['Private Balcony', 'Nespresso Machine', 'Rain Shower', 'Smart TV'],
                weekend_price: 22000
            }
        },
        {
            name: 'Presidential Suite',
            type: 'suite',
            size: '150 m²',
            bed: 'Master King Bed',
            view: 'Panoramic Ocean View',
            price_per_night: 45000,
            max_occupancy: 4,
            features: {
                amenities: ['Private Pool', 'Butler Service', 'Dining Area', 'Kitchenette'],
                weekend_price: 55000
            }
        }
    ],
    'Shangri-La Le Touessrok': [
        {
            name: 'Coral Deluxe Room',
            type: 'room',
            size: '54 m²',
            bed: 'King Bed',
            view: 'Ocean View',
            price_per_night: 19000,
            max_occupancy: 2,
            features: {
                amenities: ['Terrace', 'Marble Bathroom', 'Tea/Coffee Facility'],
                weekend_price: 23000
            }
        },
        {
            name: 'Frangipani Suite',
            type: 'suite',
            size: '70 m²',
            bed: 'King Bed',
            view: 'Beach Front',
            price_per_night: 32000,
            max_occupancy: 4,
            features: {
                amenities: ['Private Beach Access', 'Exclusive Pool', 'Free Mini Bar'],
                weekend_price: 38000
            }
        },
        {
            name: 'Royal Villa',
            type: 'villa',
            size: '300 m²',
            bed: '3 Bedrooms',
            view: 'Private Island',
            price_per_night: 120000,
            max_occupancy: 6,
            features: {
                amenities: ['Infinity Pool', 'Private Chef', 'Dedicated Butler', 'Gym'],
                weekend_price: 150000
            }
        }
    ],
    'Cotton Bay Hotel': [
        {
            name: 'Superior Room',
            type: 'room',
            size: '35 m²',
            bed: 'King Bed',
            view: 'Ocean View',
            price_per_night: 8500,
            max_occupancy: 2,
            features: {
                amenities: ['Balcony', 'AC', 'Mini Bar'],
                weekend_price: 9500
            }
        },
        {
            name: 'Deluxe Room',
            type: 'room',
            size: '40 m²',
            bed: 'King Bed',
            view: 'Pool & Sea View',
            price_per_night: 10500,
            max_occupancy: 3,
            features: {
                amenities: ['Terrace', 'Lounge Area', 'Daily Housekeeping'],
                weekend_price: 12000
            }
        }
    ],
    'Rodrigues Island Resort': [
        {
            name: 'Sea View Room',
            type: 'room',
            size: '42 m²',
            bed: 'Queen Bed',
            view: 'Lagoon View',
            price_per_night: 9000,
            max_occupancy: 2,
            features: {
                amenities: ['Private Balcony', 'WiFi', 'Coffee Station'],
                weekend_price: 11000
            }
        },
        {
            name: 'Family Suite',
            type: 'suite',
            size: '65 m²',
            bed: 'King Bed + 2 Singles',
            view: 'Ocean Front',
            price_per_night: 14500,
            max_occupancy: 5,
            features: {
                amenities: ['Kitchenette', 'Spacious Living Area', 'Interconnected Rooms'],
                weekend_price: 17000
            }
        }
    ],
    'Blue Lagoon Hotel': [
        {
            name: 'Standard Bungalow',
            type: 'room',
            size: '30 m²',
            bed: 'Double Bed',
            view: 'Tropical Garden',
            price_per_night: 7500,
            max_occupancy: 2,
            features: {
                amenities: ['Veranda', 'Hammock', 'Cooler Box'],
                weekend_price: 8500
            }
        },
        {
            name: 'Honeymoon Studio',
            type: 'suite',
            size: '45 m²',
            bed: 'King Bed',
            view: 'Sunset View',
            price_per_night: 12000,
            max_occupancy: 2,
            features: {
                amenities: ['Outdoor Shower', 'Private Sundeck', 'Champagne on Arrival'],
                weekend_price: 15000
            }
        }
    ]
};

const enrichRooms = async () => {
    try {
        console.log('Fetching Hotels for Room Enrichment...');
        const { data: hotels, error } = await supabase
            .from('services')
            .select('id, name')
            .eq('type', 'hotel');

        if (error) throw error;

        for (const hotel of hotels) {
            const roomsData = roomEnrichment[hotel.name];
            if (roomsData) {
                console.log(`Enriching rooms for ${hotel.name}...`);

                // Delete old rooms first to ensure clean state for our demo
                await supabase.from('hotel_rooms').delete().eq('service_id', hotel.id);

                for (const room of roomsData) {
                    const { error: insError } = await supabase
                        .from('hotel_rooms')
                        .insert({
                            service_id: hotel.id,
                            name: room.name,
                            type: room.type,
                            size: room.size,
                            bed: room.bed,
                            view: room.view,
                            price_per_night: room.price_per_night,
                            max_occupancy: room.max_occupancy,
                            features: room.features
                        });

                    if (insError) {
                        console.error(`Failed to insert room ${room.name}: ${insError.message}`);
                    } else {
                        console.log(`- Inserted: ${room.name}`);
                    }
                }
            }
        }

        console.log('Room enrichment completed.');
        process.exit(0);
    } catch (err) {
        console.error('Enrichment failed:', err.message);
        process.exit(1);
    }
};

enrichRooms();
