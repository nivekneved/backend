const supabase = require('../backend/config/supabase');

const checkStatusDistribution = async () => {
    try {
        console.log('--- Service Status Distribution ---');
        const { data: products, error: pError } = await supabase
            .from('services')
            .select('type, category, status');

        if (pError) throw pError;

        const distribution = {};
        products.forEach(p => {
            const key = `${p.type} | ${p.category} | Status: ${p.status}`;
            distribution[key] = (distribution[key] || 0) + 1;
        });

        console.log('Type | Category | Status | Count');
        console.log('--------------------------------');
        Object.entries(distribution)
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

checkStatusDistribution();
