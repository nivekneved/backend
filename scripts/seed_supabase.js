const supabase = require('./config/supabase');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        console.log('Connected to Supabase for seeding...');

        // NOTE: In Supabase, we usually use the Dashboard for bulk clears, 
        // but for dev parity we can delete.
        await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('admins').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('settings').delete().neq('key', '');

        // Create Admin
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const { error: adminError } = await supabase.from('admins').insert([{
            username: 'admin',
            email: 'admin@travellounge.mu',
            password: hashedPassword,
            role: 'admin'
        }]);
        if (adminError) throw adminError;
        console.log('Admin account created: admin@travellounge.mu / admin123');

        // Create Settings
        const initialSettings = [
            { key: 'AMADEUS_CLIENT_ID', value: 'ENTER_KEY_HERE', category: 'api' },
            { key: 'AMADEUS_CLIENT_SECRET', value: 'ENTER_SECRET_HERE', category: 'api' },
            { key: 'DATA_RETENTION_MONTHS', value: '12', category: 'compliance' }
        ];
        const { error: settingsError } = await supabase.from('settings').insert(initialSettings);
        if (settingsError) throw settingsError;

        // Create Premium Products
        const products = [
            {
                name: 'LUX* Grand Gaube Resort & Villas',
                description: 'Kelly Hoppen designed Retro-Chic tropical retreat. Features 2 crystal clear beaches, 3 swimming pools, and a world-class Gin Bar.',
                category: 'hotels',
                pricing: { basePrice: 15400, currency: 'MUR' },
                location: 'Grand Gaube, Mauritius',
                images: ['https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop'],
                inventory: { totalQuantity: 20, availableQuantity: 15, stopSale: false, minBookingDays: 1 },
                hotel_details: { roomType: 'Junior Suite', starRating: 5 },
                is_featured: true
            },
            {
                name: 'Heritage Le Telfair Golf & Wellness',
                description: 'Member of Small Luxury Hotels. Colonial architecture meets sophisticated island living.',
                category: 'hotels',
                pricing: { basePrice: 18900, currency: 'MUR' },
                location: 'Bel Ombre, South',
                images: ['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop'],
                inventory: { totalQuantity: 10, availableQuantity: 4, stopSale: false, minBookingDays: 3 },
                hotel_details: { roomType: 'Garden View Room', starRating: 5 },
                is_featured: true
            },
            {
                name: 'Full Day Ile aux Cerfs Catamaran',
                description: 'Sail across the turquoise lagoon of the East. Waterfall, BBQ lunch, and pristine beaches.',
                category: 'excursions',
                pricing: { basePrice: 2800, currency: 'MUR' },
                location: 'Trou d\'Eau Douce',
                images: ['https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=800&auto=format&fit=crop'],
                inventory: { totalQuantity: 50, availableQuantity: 32, stopSale: false, minBookingDays: 1 },
                is_featured: true
            }
        ];

        const { error: servicesError } = await supabase.from('services').insert(products);
        if (servicesError) throw servicesError;

        console.log('Database seeded successfully in Supabase with premium content!');
        process.exit();
    } catch (error) {
        console.error('Error seeding Supabase:', error.message);
        process.exit(1);
    }
};

seedData();
