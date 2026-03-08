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

const updates = [
    {
        name: 'Flights',
        image_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=1200&auto=format&fit=crop'
    },
    {
        name: 'Group Tours',
        image_url: 'https://images.unsplash.com/photo-1539635278303-d4002c07dee3?q=80&w=1200&auto=format&fit=crop'
    },
    {
        name: 'Rodrigues',
        image_url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop'
    }
];

const updateCategoryImages = async () => {
    try {
        console.log('🔄 Updating Category Images...');

        for (const update of updates) {
            const { data, error } = await supabase
                .from('categories')
                .update({ image_url: update.image_url })
                .ilike('name', `%${update.name}%`)
                .select();

            if (error) {
                console.error(`❌ Error updating ${update.name}:`, error.message);
            } else if (data && data.length > 0) {
                console.log(`✅ Successfully updated image for: ${data[0].name}`);
            } else {
                console.log(`⚠️  Category not found: ${update.name}`);
            }
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
};

updateCategoryImages();
