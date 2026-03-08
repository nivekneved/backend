const supabase = require('../config/supabase');

const packages = [
    {
        name: "Honeymoon Bliss",
        category: "packages",
        description: "Experience the ultimate romantic getaway in paradise. From private sunset cruises to couple's spa treatments, every moment is crafted for love.",
        location: "Grand Baie, Mauritius",
        price: 125000,
        currency: "MUR",
        images: [
            "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1000&auto=format&fit=crop"
        ],
        itinerary: [
            {
                day: 1,
                title: "VIP Arrival & Private Transfer",
                description: "Touch down in paradise. Your private chauffeur awaits with chilled champagne and refreshing towels. Enjoy a scenic luxury transfer to your 5-star beachfront suite.",
                activities: [
                    { time: "14:00", description: "Private Transfer to Resort" },
                    { time: "19:00", description: "Welcome Candlelit Dinner on the Beach" }
                ]
            },
            {
                day: 2,
                title: "Catamaran Cruise to Gabriel Island",
                description: "Set sail on a private catamaran. Snorkel in crystal clear waters, enjoy a BBQ lunch on board, and relax on the pristine beaches of Gabriel Island.",
                activities: [
                    { time: "09:00", description: "Departure from Grand Baie" },
                    { time: "12:30", description: "BBQ Lunch with Lobster" },
                    { time: "16:00", description: "Return sail with Sunset Cocktails" }
                ]
            },
            {
                day: 3,
                title: "Couple's Spa Retreat",
                description: "Indulge in a 3-hour signature spa journey using indigenous herbs and oils. Reconnect with a side-by-side massage overlooking the ocean.",
                activities: [
                    { time: "10:00", description: "Aromatherapy Massage" },
                    { time: "13:00", description: "Healthy Spa Lunch" }
                ]
            },
            {
                day: 4,
                title: "Leisure & Local Culture",
                description: "A free morning to enjoy the resort facilities. In the afternoon, explore the local markets and botanical gardens.",
                activities: [
                    { time: "15:00", description: "Pamplemousses Garden Tour" },
                    { time: "17:00", description: "Sunset Drinks at a Local Bar" }
                ]
            },
            {
                day: 5,
                title: "Underwater Waterfall Helicopter Tour",
                description: "Witness the spectacular illusion of the Underwater Waterfall from above. A once-in-a-lifetime photo opportunity.",
                activities: [
                    { time: "11:00", description: "Helicopter Flight (45 mins)" }
                ]
            },
            {
                day: 6,
                title: "Romantic Sunset Horse Riding",
                description: "Ride along the deserted beaches of Le Morne at golden hour. A magical experience for two.",
                activities: [
                    { time: "16:30", description: "Horse Riding Session" },
                    { time: "20:00", description: "Farewell Gala Dinner" }
                ]
            },
            {
                day: 7,
                title: "Departure",
                description: "Enjoy a final breakfast before your private transfer to the airport.",
                activities: [
                    { time: "10:00", description: "Check-out" },
                    { time: "11:00", description: "Airport Transfer" }
                ]
            }
        ]
    },
    {
        name: "Family Adventure",
        category: "packages",
        description: "Fun for the whole family! Encounters with lions, submarine dives, and endless beach activities ensure memories for a lifetime.",
        location: "Flic en Flac, Mauritius",
        price: 180000,
        currency: "MUR",
        images: [
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1605218427368-35b0fd73e970?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1000&auto=format&fit=crop"
        ],
        itinerary: [
            {
                day: 1,
                title: "Welcome to the Playground",
                description: "Arrive at your family-friendly resort. Kids go straight to the Kids Club while parents enjoy a welcome drink.",
                activities: [
                    { time: "14:00", description: "Check-in & Kids Club Registration" }
                ]
            },
            {
                day: 2,
                title: "Casela Nature Park Safari",
                description: "A full day at Casela World of Adventures. Walk with lions (adults) or feed the giraffes. Try the toboggan slide!",
                activities: [
                    { time: "09:00", description: "Park Entry & Safari Truck" },
                    { time: "12:00", description: "Lunch at the Park" },
                    { time: "14:00", description: "Animal Encounters" }
                ]
            },
            {
                day: 3,
                title: "Submarine Adventure",
                description: "Dive 35 meters deep in a real submarine. See shipwrecks and coral reefs without getting wet.",
                activities: [
                    { time: "10:00", description: "Standard Submarine Dive (45 mins)" }
                ]
            },
            {
                day: 4,
                title: "Beach Olympics",
                description: "Organized beach games for the family - volleyball, sandcastle building, and kayak races.",
                activities: [
                    { time: "10:00", description: "Beach Games" },
                    { time: "13:00", description: "Family Pizza Lunch" }
                ]
            },
            {
                day: 5,
                title: "Dolphin Watch",
                description: "An early morning speed boat trip to see wild dolphins in Tamarin Bay.",
                activities: [
                    { time: "07:30", description: "Speed Boat Departure" },
                    { time: "09:00", description: "Swimming with Dolphins" }
                ]
            }
        ]
    },
    {
        name: "Eco-Discovery",
        category: "packages",
        description: "Immerse yourself in nature. Hike lush gorges, visit coloured earths, and stay in eco-lodges surrounded by forest.",
        location: "Chamarel, Mauritius",
        price: 95000,
        currency: "MUR",
        images: [
            "https://images.unsplash.com/photo-1440778303588-435521a205bc?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop"
        ],
        itinerary: [
            {
                day: 1,
                title: "Black River Gorges Hike",
                description: "Guided trek through the largest national park. Spot rare birds and swim in hidden waterfalls.",
                activities: [
                    { time: "08:00", description: "Start of Hike" },
                    { time: "12:00", description: "Picnic by the River" }
                ]
            },
            {
                day: 2,
                title: "Chamarel Seven Coloured Earth",
                description: "Visit the geological marvel of 7 coloured sands and the majestic Chamarel Waterfall.",
                activities: [
                    { time: "10:00", description: "Geopark Visit" },
                    { time: "12:00", description: "Lunch at Le Chamarel Restaurant" }
                ]
            },
            {
                day: 3,
                title: "Ebony Forest Conservation",
                description: "Plant a tree and walk the raised canopy walkways. Contribute to saving Mauritius' endemic forest.",
                activities: [
                    { time: "09:30", description: "Jeep Tour to Sublime Point" },
                    { time: "11:30", description: "Tree Planting Activity" }
                ]
            }
        ]
    }
];

const seed = async () => {
    console.log('🌱 Starting Seed Process...');

    for (const pkg of packages) {
        // Check if exists
        const { data: existing } = await supabase
            .from('services')
            .select('id')
            .eq('name', pkg.name)
            .single();

        let error;
        if (existing) {
            console.log(`Updating ${pkg.name}...`);
            const { error: updateError } = await supabase
                .from('services')
                .update({
                    itinerary: pkg.itinerary,
                    description: pkg.description,
                    pricing: { basePrice: pkg.price, currency: pkg.currency },
                    images: pkg.images,
                    location: pkg.location,
                    category: pkg.category
                })
                .eq('id', existing.id);
            error = updateError;
        } else {
            console.log(`Creating ${pkg.name}...`);
            const { data: inserted, error: insertError } = await supabase
                .from('services')
                .insert([{
                    name: pkg.name,
                    category: pkg.category,
                    description: pkg.description,
                    location: pkg.location,
                    pricing: { basePrice: pkg.price, currency: pkg.currency },
                    images: pkg.images,
                    itinerary: pkg.itinerary,
                    is_featured: true
                }])
                .select(); // Return the inserted data

            if (inserted) console.log(`   > Inserted ID: ${inserted[0]?.id}`);
            error = insertError;
        }

        if (error) {
            console.error(`❌ Error processing ${pkg.name}:`, error.message);
        } else {
            console.log(`✅ Successfully processed ${pkg.name}`);
        }
    }

    console.log('✨ Seed Process Complete!');
};

seed();
