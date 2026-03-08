const supabase = require('../config/supabase');

const inspect = async () => {
    console.log('🔍 Inspecting Services Schema...');
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Error:', error.message);
    } else if (data.length === 0) {
        console.log('⚠️ No data found in services table.');
    } else {
        console.log('✅ Column Names:', Object.keys(data[0]).join(', '));
    }
};

inspect();
