const supabase = require('../backend/config/supabase');

const inspectTable = async () => {
    try {
        // Since we can't use rpc directly for schema easily, let's just select one item and see keys
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            console.log('Columns in services table:');
            console.log(Object.keys(data[0]).join(', '));
        } else {
            console.log('No data found in services table.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

inspectTable();
