const supabase = require('../backend/config/supabase');

const enrichmentData = {
    'Sunset Catamaran Cruise': {
        itinerary: [
            { time: '16:00', activity: 'Boarding at Grand Baie' },
            { time: '16:30', activity: 'Sailing along the north coast' },
            { time: '17:30', activity: 'Sunset viewing with cocktails' },
            { time: '18:30', activity: 'Return to Grand Baie' }
        ],
        inclusions: ['Snacks', 'Unlimited Drinks', 'Live Music', 'Expert Crew'],
        highlights: ['Northern Lagoon Views', 'Spectacular Sunset', 'Premium Beverages']
    },
    'Seven Coloured Earth Tour': {
        itinerary: [
            { time: '09:00', activity: 'Pick up from hotel' },
            { time: '10:30', activity: 'Visit Chamarel Seven Coloured Earth' },
            { time: '11:30', activity: 'Chamarel Waterfall viewing' },
            { time: '12:30', activity: 'Rum Distillery tour and tasting' },
            { time: '14:30', activity: 'Drop off at hotel' }
        ],
        inclusions: ['Private Transport', 'Entrance Fees', 'Rum Tasting', 'Professional Guide'],
        highlights: ['Natural Phenomenon', 'Highest Waterfall', 'Artisanal Rum']
    },
    'Grand Baie Luxury Resort': {
        itinerary: [
            { time: 'Check-in: 14:00', activity: 'Welcome drink and orientation' },
            { time: 'Daily 08:00', activity: 'Yoga session on the beach' },
            { time: 'Daily 19:00', activity: 'Themed dinner at the main restaurant' }
        ],
        inclusions: ['Daily Breakfast', 'Free WiFi', 'Non-motorized Water Sports', 'Kids Club Access'],
        highlights: ['Beachfront Location', 'Award-winning Spa', 'Luxury Suites']
    },
    'Catamaran Cruise to Ile aux Cerfs': {
        itinerary: [
            { time: '09:00', activity: 'Departure from Trou d\'Eau Douce' },
            { time: '10:30', activity: 'Snorkeling at Eau Bleue' },
            { time: '12:30', activity: 'BBQ Lunch on board' },
            { time: '14:00', activity: 'Leisure time at Ile aux Cerfs' },
            { time: '16:00', activity: 'Return journey' }
        ],
        inclusions: ['BBQ Lunch', 'Unlimited Beverages', 'Snorkeling Equipment', 'Hotel Transfer'],
        highlights: ['Crystal Clear Lagoon', 'Seaside BBQ', 'Paradise Island']
    }
    // Add more as needed...
};

const enrichServices = async () => {
    try {
        console.log('--- Enriching Existing Services ---');

        for (const [name, data] of Object.entries(enrichmentData)) {
            const { error } = await supabase
                .from('services')
                .update({
                    itinerary: data.itinerary,
                    inclusions: data.inclusions,
                    highlights: data.highlights
                })
                .eq('name', name);

            if (error) {
                console.error(`Error enriching ${name}:`, error.message);
            } else {
                console.log(`Successfully enriched: ${name}`);
            }
        }

        console.log('\n--- Enriching Hotel Room Policies ---');
        // Standard policy for all hotel rooms as a base
        const standardPolicies = [
            'No smoking in rooms',
            'Check-out time: 11:00 AM',
            'No pets allowed',
            'Quiet hours after 10:00 PM'
        ];
        const cancellationPolicy = 'Full refund if cancelled 48 hours before arrival. 50% refund after that.';
        const deposit_policy = 'A 20% deposit is required at the time of booking.';

        const { error: roomError } = await supabase
            .from('hotel_rooms')
            .update({
                policies: standardPolicies,
                cancellation_policy: cancellationPolicy,
                deposit_policy: deposit_policy
            })
            .not('id', 'is', null); // Update all

        if (roomError) {
            console.error('Error enriching hotel rooms:', roomError.message);
        } else {
            console.log('Successfully enriched all hotel rooms with policies.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Enrichment failed:', err.message);
        process.exit(1);
    }
};

enrichServices();
