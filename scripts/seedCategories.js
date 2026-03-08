const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
    {
        name: 'Hotels',
        slug: 'hotels',
        icon: 'Hotel',
        image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        link: '/search?category=hotels',
        display_order: 1,
        is_active: true
    },
    {
        name: 'Cruises',
        slug: 'cruises',
        icon: 'Ship',
        image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1200&auto=format&fit=crop',
        link: '/search?category=cruises',
        display_order: 2,
        is_active: true
    },
    {
        name: 'Excursions',
        slug: 'excursions',
        icon: 'Mountain',
        image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=1200&auto=format&fit=crop',
        link: '/search?category=excursions',
        display_order: 3,
        is_active: true
    },
    {
        name: 'Flights',
        slug: 'flights',
        icon: 'Plane',
        image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        link: '/search?category=flights',
        display_order: 4,
        is_active: true
    },
    {
        name: 'Transfers',
        slug: 'transfers',
        icon: 'MapPin', // Fallback as Car not in iconMap yet
        image_url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
        link: '/search?category=transfers',
        display_order: 5,
        is_active: true
    },
    {
        name: 'Group Tours',
        slug: 'group-tours',
        icon: 'Users',
        image_url: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&w=800&q=80',
        link: '/search?category=group-tours',
        display_order: 6,
        is_active: true
    }
];

const seedCategories = async () => {
    try {
        console.log('🌱 Seeding Categories...');

        // Upsert categories based on slug
        const { data, error } = await supabase
            .from('categories')
            .upsert(categories, { onConflict: 'slug' })
            .select();

        if (error) {
            console.error('❌ Error seeding categories:', error.message);
        } else {
            console.log(`✅ Successfully seeded ${data.length} categories.`);
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
};

seedCategories();
