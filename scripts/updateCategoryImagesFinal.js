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
        names: ['Flights', 'Flight'],
        image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=1200&auto=format&fit=crop'
    },
    {
        names: ['Group Tours', 'Group Tour'],
        image_url: 'https://images.unsplash.com/photo-1539635278303-d4002c07dee3?q=80&w=1200&auto=format&fit=crop'
    },
    {
        names: ['Rodrigues'],
        image_url: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200&auto=format&fit=crop'
    }
];

const updateCategoryImages = async () => {
    try {
        console.log('🔄 Finalizing Category Image Updates...');

        for (const update of updates) {
            let success = false;
            for (const name of update.names) {
                const { data, error } = await supabase
                    .from('categories')
                    .update({ image_url: update.image_url })
                    .ilike('name', `%${name}%`);

                if (!error) {
                    // Check if anything was updated
                    const { count } = await supabase
                        .from('categories')
                        .select('*', { count: 'exact', head: true })
                        .ilike('name', `%${name}%`);

                    if (count > 0) {
                        console.log(`✅ Successfully updated image for: ${name}`);
                        success = true;
                        break;
                    }
                }
            }
            if (!success) {
                console.log(`⚠️  Could not find category for: ${update.names.join(' or ')}`);
            }
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
};

updateCategoryImages();
