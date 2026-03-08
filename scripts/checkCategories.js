
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('id, name, link, is_active');

    if (error) {
        console.error('Error fetching categories:', error);
        return;
    }

    console.log('Categories:', data);
}

checkCategories();
