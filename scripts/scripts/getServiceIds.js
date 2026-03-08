const supabase = require('../backend/config/supabase');

const listServiceNames = async () => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('id, name, category');

        if (error) throw error;

        data.forEach(s => console.log(`${s.name} | ${s.category} | ${s.id}`));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

listServiceNames();
