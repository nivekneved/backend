const supabase = require('../config/supabase');

const clear = async () => {
    console.log('🧹 Clearing Services Table...');

    // Check if table is empty
    const { count } = await supabase.from('services').select('*', { count: 'exact', head: true });

    if (count === 0) {
        console.log('✅ Table is already empty.');
        return;
    }

    // Delete all rows
    const { error } = await supabase
        .from('services')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete everything (hack to delete all)

    if (error) {
        console.error('❌ Error clearing table:', error.message);
    } else {
        console.log('✅ Services table cleared successfully.');
    }
};

clear();
