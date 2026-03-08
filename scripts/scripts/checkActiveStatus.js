const supabase = require('../backend/config/supabase');

const checkActiveStatus = async () => {
    try {
        console.log('--- Service Active Status ---');
        const { data: products, error: pError } = await supabase
            .from('services')
            .select('id, name, type, category, is_active');

        if (pError) throw pError;

        const statusCounts = {};
        products.forEach(p => {
            const key = `${p.type} | ${p.category} | Active: ${p.is_active}`;
            statusCounts[key] = (statusCounts[key] || 0) + 1;
        });

        console.log('Type | Category | Active | Count');
        console.log('-------------------------------');
        Object.entries(statusCounts)
            .sort((a, b) => b[1] - a[1])
            .forEach(([key, count]) => {
                console.log(`${key} | ${count}`);
            });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkActiveStatus();
