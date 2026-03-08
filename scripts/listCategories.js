const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Key to bypass RLS for initial check, then we can check anon

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const listCategories = async () => {
    try {
        console.log('🔍 Listing all categories (Service Key)...');
        const { data, error } = await supabase
            .from('categories')
            .select('*');

        if (error) {
            console.error('❌ Supabase Error:', error.message);
        } else {
            console.log(`✅ Found ${data.length} categories:`);
            data.forEach(c => {
                console.log(` - [${c.id}] ${c.name} (Active: ${c.is_active}) (Icon: ${c.icon})`);
            });
        }
    } catch (err) {
        console.error('❌ Unexpected Error:', err.message);
    }
};

listCategories();
