const supabase = require('../backend/config/supabase');

const inspectHotels = async () => {
    try {
        const { data, error } = await supabase
            .from('hotels')
            .select('*')
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            console.log('Sample Data from hotels:');
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log('No data found in hotels table.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

inspectHotels();
