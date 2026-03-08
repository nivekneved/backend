const supabase = require('../config/supabase');

const check = async () => {
    console.log('🔍 Checking for specific columns...');

    // Try to select the columns we need
    const { data, error } = await supabase
        .from('services')
        .select('id, name, itinerary, images, pricing, is_featured')
        .limit(1);

    if (error) {
        console.error('❌ Error selecting columns:', error.message);
    } else {
        console.log('✅ Columns exist!');
    }
};

check();
