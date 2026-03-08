const supabase = require('../backend/config/supabase');

const CABIN_TYPES = [
    {
        name: 'Inside Cabin',
        description: 'Cozy and comfortable cabin without a window, perfect for travelers who prefer to spend most of their time exploring the ship.',
        price_modifier: 0,
        amenities: ['Twin/Queen Bed', 'Private Bathroom', 'TV', 'Hairdryer'],
        images: ['https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800']
    },
    {
        name: 'Oceanview Cabin',
        description: 'Features a large porthole or window offering beautiful views of the sea as you sail between destinations.',
        price_modifier: 25,
        amenities: ['Window View', 'Queen Bed', 'Private Bathroom', 'Mini Fridge', 'TV'],
        images: ['https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800']
    },
    {
        name: 'Balcony Cabin',
        description: 'Enjoy fresh sea air and private outdoor space with your own private balcony overlooking the ocean.',
        price_modifier: 50,
        amenities: ['Private Balcony', 'Queen Bed', 'Siting Area', 'Mini Bar', 'Premium Bath Products'],
        images: ['https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800']
    },
    {
        name: 'Luxury Suite',
        description: 'Our most spacious accommodation featuring a separate living area, large private balcony, and VIP ship privileges.',
        price_modifier: 100,
        amenities: ['VIP Priority Boarding', 'Concierge Service', 'Separate Living Room', 'Spacious Balcony', 'Butler Service'],
        images: ['https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800']
    }
];

const addCruiseCabins = async () => {
    try {
        console.log('Fetching cruises...');
        const { data: cruises, error: cruiseError } = await supabase
            .from('services')
            .select('id, pricing, name')
            .eq('type', 'cruise');

        if (cruiseError) throw cruiseError;

        console.log(`Found ${cruises.length} cruises. Adding cabins...`);

        for (const cruise of cruises) {
            const basePrice = cruise.pricing?.base_price || 0;

            // Delete existing rooms for this service to avoid duplicates during re-runs
            await supabase.from('hotel_rooms').delete().eq('service_id', cruise.id);

            const roomsToInsert = CABIN_TYPES.map(cabin => ({
                service_id: cruise.id,
                name: cabin.name,
                price_per_night: Math.round(basePrice * (1 + cabin.price_modifier / 100)),
                features: [...cabin.amenities, cabin.description], // Tucking description into features
                image_url: cabin.images[0],
                max_occupancy: 2,
                total_units: 10,
                bed: cabin.amenities.includes('Queen Bed') ? 'Queen' : 'Twin',
                view: cabin.name.includes('Oceanview') || cabin.name.includes('Balcony') || cabin.name.includes('Suite') ? 'Ocean View' : 'No View',
                type: 'Cabin'
            }));

            const { error: insertError } = await supabase.from('hotel_rooms').insert(roomsToInsert);
            if (insertError) {
                console.error(`Error adding cabins for ${cruise.name}:`, insertError.message);
            } else {
                console.log(`Added 4 cabins for: ${cruise.name}`);
            }
        }

        console.log('Finished adding cruise cabins.');
        process.exit(0);
    } catch (err) {
        console.error('Fatal Error:', err.message);
        process.exit(1);
    }
};

addCruiseCabins();
