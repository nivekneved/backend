const supabase = require('../backend/config/supabase');

const checkWildlife = async () => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('name, description, category')
            .eq('category', 'Wildlife');

        if (error) throw error;
        console.log('Wildlife Item:', data);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkWildlife();
