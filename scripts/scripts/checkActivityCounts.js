const supabase = require('../backend/config/supabase');

const checkCounts = async () => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('category, name')
            .eq('type', 'activity');

        if (error) throw error;

        const counts = data.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
        }, {});

        Object.entries(counts).forEach(([cat, count]) => {
            console.log(`- ${cat}: ${count}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkCounts();
