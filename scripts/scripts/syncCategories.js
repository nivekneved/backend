const supabase = require('../backend/config/supabase');

const updateCategories = async () => {
    try {
        console.log('Syncing categories to match user request...');

        // 1. Clear existing categories
        const { error: clearError } = await supabase
            .from('categories')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000');

        if (clearError) throw clearError;

        const categories = [
            {
                name: 'Cruises',
                slug: 'cruises',
                icon: 'Ship',
                link: '/cruises',
                image_url: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=800',
                display_order: 1,
                is_active: true
            },
            {
                name: 'Flight',
                slug: 'flight',
                icon: 'Plane',
                link: '/flights',
                image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800',
                display_order: 2,
                is_active: true
            },
            {
                name: 'Group Tours',
                slug: 'group-tours',
                icon: 'Users',
                link: '/group-tours',
                image_url: 'https://images.unsplash.com/photo-1539635278303-d4002c07dee3?q=80&w=800',
                display_order: 3,
                is_active: true
            },
            {
                name: 'Rodrigues',
                slug: 'rodrigues',
                icon: 'Umbrella',
                link: '/rodrigues-hotels',
                image_url: 'https://images.unsplash.com/photo-1589394815804-964ed7be2eb5?q=80&w=800',
                display_order: 4,
                is_active: true
            },
            {
                name: 'Mauritius Hotels',
                slug: 'mauritius-hotels',
                icon: 'Hotel',
                link: '/hotels',
                image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800',
                display_order: 5,
                is_active: true
            },
            {
                name: 'Day Packages',
                slug: 'day-packages',
                icon: 'Calendar',
                link: '/day-packages',
                image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
                display_order: 6,
                is_active: true
            }
        ];

        const { data, error } = await supabase
            .from('categories')
            .insert(categories)
            .select();

        if (error) throw error;
        console.log('Successfully synced 6 categories:', data.map(c => c.name).join(', '));
        process.exit(0);
    } catch (err) {
        console.error('Error syncing categories:', err.message);
        process.exit(1);
    }
};

updateCategories();
