const supabase = require('../backend/config/supabase');

const enrichmentMap = {
    keywords: [
        {
            regex: /Catamaran|Cruise/i,
            data: {
                itinerary: [
                    { day: 1, title: 'Departure & Coastal Cruise', description: 'Set sail from the turquoise jetty, enjoying morning breeze and stunning coastline views.' },
                    { day: 2, title: 'Island Exploration', description: 'Anchor at a private island for snorkeling among vibrant coral reefs and a BBQ lunch on the beach.' },
                    { day: 3, title: 'Sun & Return', description: 'Leisurely morning swimming, followed by a scenic return cruise as the sun begins to set.' }
                ],
                inclusions: ['Gourmet Dining', 'Evening Entertainment', 'Luxury Cabin Accommodation', 'All Port Fees & Taxes'],
                highlights: ['Multi-Country Discovery', 'Premium Ship Facilities', 'World-Class Service', 'Signature Experiences'],
                features: ['Infinity Pool', 'State-of-the-Art Spa', 'Multiple Fine Dining Venues', 'Theatrical Performances', 'Casino & Lounges']
            }
        },
        {
            regex: /Tour|Hiking|Biking|Safari|Park/i,
            data: {
                itinerary: [
                    { day: 1, title: 'Arrival & Nature Walk', description: 'Pick-up from accommodation followed by a guided nature walk through indigenous forests.' },
                    { day: 2, title: 'Adventure & Wildlife', description: 'Full day of exploration, including wildlife spotting and a traditional Mauritian lunch in the wild.' },
                    { day: 3, title: 'Panoramas & Departure', description: 'Morning session at the most famous viewpoints before returning to your hotel.' }
                ],
                inclusions: ['Private Guided Tour', 'All Entrance Fees', 'Botanical Water Bottled', 'Local Lunch'],
                highlights: ['Expert Local Knowledge', 'Flora and Fauna Exploration', 'Breathtaking Panoramic Views']
            }
        },
        {
            regex: /Day Retreat|Day Pass|Pass/i,
            data: {
                itinerary: [
                    { day: 1, title: 'Morning Welcome', description: 'Welcome drink at the resort lobby followed by full access to premium beach facilities.' },
                    { day: 2, title: 'Mid-Day Gastronomy', description: 'Sumptuous buffet lunch at the main restaurant with unlimited soft drinks.' },
                    { day: 3, title: 'Afternoon Leisure', description: 'Access to non-motorized water sports and spa facilities before departure.' }
                ],
                inclusions: ['Choice of 3-Course Menu or Buffet Lunch', 'Pool and Beach Access', 'Fitness Center Access', 'Shower Room Availability'],
                highlights: ['Luxury Resort Facilities', 'Premium Gastronomy', 'Relaxing Ambiance']
            }
        },
        {
            regex: /Hotel|Resort|Lodge|Villa/i,
            data: {
                itinerary: [
                    { day: 1, title: 'Check-in & Welcome', description: 'Premium check-in experience with a signature welcome cocktail and property tour.' },
                    { day: 2, title: 'Resort Living', description: 'Daily gourmet breakfast and access to all resort amenities including pools and gym.' },
                    { day: 3, title: 'Leisurely Check-out', description: 'Enjoy a final morning by the water before our standard 11:00 AM check-out.' }
                ],
                inclusions: ['Daily Gourmet Breakfast', 'Free Unlimited High-Speed WiFi', 'Complimentary Parking', 'Housekeeping services'],
                highlights: ['Breathtaking Views', 'Premium Bedding', 'Eco-friendly Amenities']
            }
        }
    ],
    categories: {
        'Sea Activities': {
            itinerary: [
                { day: 1, title: 'Marine Briefing', description: 'Safety briefing and boarding at the base station.' },
                { day: 2, title: 'Lagoon Discovery', description: 'Guided exploration of hidden lagoons and crystal clear snorkeling spots.' },
                { day: 3, title: 'Coastal Return', description: 'Scenic return journey with light refreshments served on board.' }
            ],
            inclusions: ['Water Safety Gear', 'Light Refreshments', 'Professional Skipper'],
            highlights: ['Azure Waters', 'Coral Reef Discovery', 'Coastal Scenery']
        },
        'Land Activities': {
            itinerary: [
                { day: 1, title: 'Meet & Greet', description: 'Professional guide meeting at the designated pick-up point.' },
                { day: 2, title: 'Land Adventure', description: 'Immersive sightseeing through lush landscapes and cultural landmarks.' },
                { day: 3, title: 'Final Vistas', description: 'Visit to panoramic viewpoints before concluding the adventure.' }
            ],
            inclusions: ['Guided Exploration', 'Bottled Water', 'Entry Permits'],
            highlights: ['Lush Landscapes', 'Cultural Landmarks', 'Unique Photo Ops']
        },
        'Day Packages': {
            itinerary: [
                { day: 1, title: 'Resort Arrival', description: 'Smooth check-in and orientation of the paradise facilities.' },
                { day: 2, title: 'Curated Dining', description: 'Chef-led lunch experience featuring fresh local ingredients.' },
                { day: 3, title: 'Sunset Leisure', description: 'Afternoon relaxation session before the package concludes.' }
            ],
            inclusions: ['Lunch & Drinks Package', 'Resort Pass', 'Free Parking'],
            highlights: ['World Class Service', 'Infinite Pool', 'Paradise Settings']
        }
    }
};

const getDefaultData = (service) => {
    // Try keywords first
    for (const kw of enrichmentMap.keywords) {
        if (kw.regex.test(service.name)) {
            return kw.data;
        }
    }
    // Try category next
    if (enrichmentMap.categories[service.category]) {
        return enrichmentMap.categories[service.category];
    }
    // Ultimate fallback (general)
    return {
        itinerary: [
            { time: '09:00', activity: 'Session starts' },
            { time: '12:00', activity: 'Lunch break' },
            { time: '15:00', activity: 'Final session' }
        ],
        highlights: ['Unique Experience', 'Value for Money', 'Memorable Moments'],
        features: ['Professional Service', 'Standard Amenities']
    };
};

const enrichAll = async () => {
    try {
        const { data: services, error } = await supabase
            .from('services')
            .select('*');

        if (error) throw error;

        console.log(`Auditing and enriching ${services.length} services...`);

        for (const service of services) {
            const updates = {};
            const standard = getDefaultData(service);

            // Force update to standardized format
            updates.itinerary = standard.itinerary;
            updates.inclusions = standard.inclusions;
            updates.highlights = standard.highlights;
            updates.features = standard.features;

            if (Object.keys(updates).length > 0) {
                const { error: upError } = await supabase
                    .from('services')
                    .update(updates)
                    .eq('id', service.id);

                if (upError) {
                    console.error(`Failed to update ${service.name}: ${upError.message}`);
                } else {
                    console.log(`Enriched: ${service.name}`);
                }
            } else {
                console.log(`Skipped (already complete): ${service.name}`);
            }
        }

        console.log('Enrichment process completed.');
        process.exit(0);
    } catch (err) {
        console.error('Enrichment failed:', err.message);
        process.exit(1);
    }
};

enrichAll();
