const supabase = require('../backend/config/supabase');

const groupTourEnrichment = {
    'Magical Morocco': {
        itinerary: [
            { day: 1, title: 'Casablanca Arrival', description: 'Arrive in Casablanca and visit the majestic Hassan II Mosque, the largest in Africa, overlooking the Atlantic.' },
            { day: 2, title: 'Fes Medieval Wonders', description: 'Full day exploring Fes El Bali, the best-preserved medieval city in the Arab world and a UNESCO World Heritage site.' },
            { day: 3, title: 'Sahara Desert Night', description: 'Journey through the Atlas Mountains to Merzouga. Experience a sunset camel trek and sleep under the stars in a luxury desert camp.' },
            { day: 4, title: 'Atlas Mountains View', description: 'Scenic drive through the High Atlas Mountains, stopping at traditional Berber villages and ancient kasbahs.' },
            { day: 5, title: 'Marrakesh Soul', description: 'Explore the vibrant Jemaa el-Fnaa square, hidden palaces, and lush gardens of the Red City before departure.' }
        ],
        highlights: ['Sahara Desert Camping', 'Fes Medieval Medina', 'Atlas Mountain Scenery', 'Private Camel Trek'],
        inclusions: ['Luxury Riad Accommodation', 'Private Desert Camp', 'Professional Local Guides', 'Breakfast and Dinners Daily']
    },
    'South Africa Adventure': {
        itinerary: [
            { day: 1, title: 'Cape Town Arrival', description: 'Welcome to the Mother City. Meet your group for a sundowner at the V&A Waterfront.' },
            { day: 2, title: 'Table Mountain & City', description: 'Take the cable car to Table Mountain summit followed by a walking tour of the historic Bo-Kaap neighborhood.' },
            { day: 3, title: 'Cape Peninsula Tour', description: 'Drive along Chapman\'s Peak, visit the Boulders Beach penguin colony, and reach the Cape of Good Hope.' },
            { day: 4, title: 'Franschhoek Winelands', description: 'A day of relaxation and tasting in the world-famous Cape Winelands, featuring premium estates and art galleries.' },
            { day: 5, title: 'Kruger Safari Start', description: 'Fly to Kruger for your first evening game drive. Discover the "Big Five" in their natural habitat.' }
        ],
        highlights: ['Big Five Safari', 'Table Mountain Ascent', 'Penguin Colony Visit', 'World-Class Winelands'],
        inclusions: ['Boutique Hotel Stays', 'Full Safari Program', 'Internal Flights Included', 'Curated Wine Tastings']
    },
    'Classic India Golden Triangle': {
        itinerary: [
            { day: 1, title: 'Delhi Heritage', description: 'Explore Old Delhi by rickshaw, visiting the Red Fort and Chandni Chowk markets before a welcome dinner.' },
            { day: 2, title: 'Agra Journey', description: 'Drive to Agra. In the evening, visit Mehtab Bagh for a stunning sunset view of the Taj Mahal across the Yamuna River.' },
            { day: 3, title: 'Taj Mahal Sunrise', description: 'Witness the Taj Mahal at sunrise. Later, explore the massive Agra Fort, a masterpiece of Mughal architecture.' },
            { day: 4, title: 'The Pink City', description: 'Journey to Jaipur, stopping at the ghost city of Fatehpur Sikri. Evening traditional Rajasthani dinner show.' },
            { day: 5, title: 'Amer Fort & Palaces', description: 'Morning visit to the hill-top Amer Fort. Afternoon photo stop at Hawa Mahal and exploring the City Palace.' },
            { day: 6, title: 'Jaipur to Delhi', description: 'Final shopping at Jaipur markets before returning to Delhi for your international departure.' }
        ],
        highlights: ['Sunrise at Taj Mahal', 'Jaipur Rickshaw Tour', 'Amer Fort Exploration', 'Mughal Architecture'],
        inclusions: ['Heritage Hotel Accommodation', 'A/C Private Transport', 'Dedicated Tour Manager', 'Monuments Entry Fees']
    }
};

const enrichGroupTours = async () => {
    try {
        console.log('Fetching Guided Group Tours...');
        const { data: tours, error } = await supabase
            .from('services')
            .select('*')
            .or('category.eq.Group Tours,type.eq.group-tour');

        if (error) throw error;

        console.log(`Auditing ${tours.length} group tours...`);

        for (const tour of tours) {
            const data = groupTourEnrichment[tour.name];
            if (data) {
                console.log(`Enriching: ${tour.name}...`);
                const { error: upError } = await supabase
                    .from('services')
                    .update({
                        itinerary: data.itinerary,
                        highlights: data.highlights,
                        inclusions: data.inclusions,
                        features: ['Group Experience', 'Expert Guides', 'Hand-picked Hotels', 'Cultural Immersion']
                    })
                    .eq('id', tour.id);

                if (upError) {
                    console.error(`Failed to update ${tour.name}: ${upError.message}`);
                }
            } else {
                console.log(`No specific data for: ${tour.name}, applying general premium fallback.`);
                // Generic fallback for any other group tours
                await supabase
                    .from('services')
                    .update({
                        itinerary: [
                            { day: 1, title: 'Welcome & Orientation', description: 'Meeting your guide and group for a full briefing of the journey ahead.' },
                            { day: 2, title: 'Main Highlights', description: 'A full day of immersive exploration and local cultural experiences.' },
                            { day: 3, title: 'Farewell & Departure', description: 'Enjoy a final morning of discovery before the group journey concludes.' }
                        ],
                        features: ['Group Experience', 'Expert Guides', 'Hand-picked Hotels', 'Cultural Immersion']
                    })
                    .eq('id', tour.id);
            }
        }

        console.log('Group Tour enrichment completed.');
        process.exit(0);
    } catch (err) {
        console.error('Enrichment failed:', err.message);
        process.exit(1);
    }
};

enrichGroupTours();
