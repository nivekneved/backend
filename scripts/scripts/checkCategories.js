const supabase = require('../backend/config/supabase');

const checkCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        console.log('Current Categories:');
        console.log(JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error checking categories:', err.message);
        process.exit(1);
    }
};

checkCategories();
