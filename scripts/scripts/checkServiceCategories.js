const supabase = require('../backend/config/supabase');

const checkActivityCategories = async () => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('category')
            .eq('type', 'activity')
            .not('category', 'is', null);

        if (error) throw error;

        const uniqueCategories = [...new Set(data.map(s => s.category))];
        console.log('Categories:', uniqueCategories.join(', '));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkActivityCategories();
