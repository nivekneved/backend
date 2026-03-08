const supabase = require('../backend/config/supabase');

const cleanup = async () => {
    try {
        console.log('Starting final category cleanup...');

        // 1. Water Activities -> Sea Activities
        console.log('Merging Water Activities into Sea Activities...');
        const { error: error1 } = await supabase
            .from('services')
            .update({ category: 'Sea Activities' })
            .eq('category', 'Water Activities');
        if (error1) throw error1;

        // 2. Wildlife -> Land Activities
        console.log('Merging Wildlife into Land Activities...');
        const { error: error2 } = await supabase
            .from('services')
            .update({ category: 'Land Activities' })
            .eq('category', 'Wildlife');
        if (error2) throw error2;

        console.log('Cleanup successful.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err.message);
        process.exit(1);
    }
};

cleanup();
