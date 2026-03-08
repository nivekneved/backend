const supabase = require('../backend/config/supabase');

const newActivities = [
    {
        name: 'Quad Biking at Pont Naturel',
        type: 'activity',
        category: 'Land Activities',
        description: 'Experience the rugged beauty of the south coast on an exhilarating quad bike adventure to Pont Naturel.',
        location: 'Le Bouchon',
        pricing: { base_price: 2500, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1544933863-482c6ca1089d?q=80&w=1200&auto=format&fit=crop'],
        duration: '2 Hours',
        rating: 4.8,
        amenities: ['Helmet', 'Guide', 'Water', 'Safety Briefing'],
        is_featured: true
    },
    {
        name: 'Helicopter Tour: Mauritius from Above',
        type: 'activity',
        category: 'Land Activities',
        description: 'Soar above the turquoise lagoons, lush forests, and the famous Underwater Waterfall on a breathtaking helicopter tour.',
        location: 'Airport / Triolet',
        pricing: { base_price: 15000, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1534914149957-695085ba46a8?q=80&w=1200&auto=format&fit=crop'],
        duration: '30 Mins',
        rating: 5.0,
        amenities: ['Window Seat', 'Pilot Guide', 'Breathtaking Views'],
        is_featured: true
    },
    {
        name: 'Glass Bottom Boat Tour',
        type: 'activity',
        category: 'Sea Activities',
        description: 'Explore the vibrant marine life of Blue Bay Marine Park without getting wet on this guided glass bottom boat tour.',
        location: 'Blue Bay',
        pricing: { base_price: 800, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop'],
        duration: '1 Hour',
        rating: 4.5,
        amenities: ['Mask & Snorkel', 'Life Jacket', 'Expert Guide'],
        is_featured: false
    },
    {
        name: 'Casela Safari & Bird Park',
        type: 'activity',
        category: 'Land Activities',
        description: 'Get close to nature with a safari through the park, home to lions, zebras, giraffes, and hundreds of bird species.',
        location: 'Cascavelle',
        pricing: { base_price: 1200, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1551491707-16075196bacf?q=80&w=1200&auto=format&fit=crop'],
        duration: 'Full Day',
        rating: 4.7,
        amenities: ['Park Entry', 'Safari Bus', 'Bird Park Access'],
        is_featured: true
    },
    {
        name: 'Tamarind Falls Hiking',
        type: 'activity',
        category: 'Land Activities',
        description: 'Hike through the lush canyon of Tamarind Falls (7 Cascades) and swim in the natural pools beneath the waterfalls.',
        location: 'Henrietta',
        pricing: { base_price: 1500, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1544433158-751bd5d44cc9?q=80&w=1200&auto=format&fit=crop'],
        duration: '4 Hours',
        rating: 4.9,
        amenities: ['Guide', 'Safety Gear', 'Swimming Stop'],
        is_featured: false
    }
];

const newDayPackages = [
    {
        name: 'LUX* Belle Mare Day Retreat',
        type: 'day-package',
        category: 'Day Packages',
        description: 'Spend a luxurious day at the stunning LUX* Belle Mare. Includes lunch, pool access, and non-motorized water sports.',
        location: 'Belle Mare',
        pricing: { base_price: 3500, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1200&auto=format&fit=crop'],
        duration: '10 AM - 5 PM',
        rating: 4.9,
        amenities: ['Lunch Buffet', 'Pool Access', 'Beach Access', 'Water Sports'],
        is_featured: true
    },
    {
        name: 'Beachcomber Paradis Golf Day Pass',
        type: 'day-package',
        category: 'Day Packages',
        description: 'Enjoy the world-class facilities of Paradis Beachcomber. Includes a 3-course lunch and full use of resort amenities.',
        location: 'Le Morne',
        pricing: { base_price: 3200, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop'],
        duration: '9 AM - 6 PM',
        rating: 4.8,
        amenities: ['3-Course Lunch', 'Pool & Gym', 'Kids Club', 'Shower Facility'],
        is_featured: false
    },
    {
        name: 'Shangri-La Le Touessrok Exclusive Day',
        type: 'day-package',
        category: 'Day Packages',
        description: 'Experience pure luxury at Le Touessrok. Includes boat transfer to Ilot Mangénie and a premium lunch sequence.',
        location: 'Trou d\'Eau Douce',
        pricing: { base_price: 5500, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop'],
        duration: '9:30 AM - 5:30 PM',
        rating: 5.0,
        amenities: ['Private Island Transfer', 'Gourmet Lunch', 'Sunbed', 'Beach Service'],
        is_featured: true
    },
    {
        name: 'Heritage Bel Ombre Nature Day',
        type: 'day-package',
        category: 'Day Packages',
        description: 'Immerse yourself in nature at the Heritage Bel Ombre estate. Includes lunch at the beach club and afternoon tea.',
        location: 'Bel Ombre',
        pricing: { base_price: 2800, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop'],
        duration: '10 AM - 6 PM',
        rating: 4.7,
        amenities: ['Lunch', 'Afternoon Tea', 'Pool Access', 'Land Activities'],
        is_featured: false
    },
    {
        name: 'Club Med La Pointe Day Pass',
        type: 'day-package',
        category: 'Day Packages',
        description: 'All-inclusive day pass at Club Med. Unlimited food, drinks, sports, and entertainment throughout the day.',
        location: 'Pointe aux Canonniers',
        pricing: { base_price: 4500, currency: 'MUR' },
        images: ['https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?q=80&w=1200&auto=format&fit=crop'],
        duration: '10 AM - 6 PM',
        rating: 4.9,
        amenities: ['Unlimited Food', 'Unlimited Drinks', 'Sports Academy', 'Show & Party'],
        is_featured: true
    }
];

const seedData = async () => {
    try {
        console.log('--- Seeding Activities ---');
        const { error: actError } = await supabase.from('services').insert(newActivities);
        if (actError) throw actError;
        console.log('Activities seeded successfully.');

        console.log('--- Seeding Day Packages ---');
        const { error: pkgError } = await supabase.from('services').insert(newDayPackages);
        if (pkgError) throw pkgError;
        console.log('Day Packages seeded successfully.');

        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
};

seedData();
