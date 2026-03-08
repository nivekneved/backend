const supabase = require('../backend/config/supabase');

const fetchCruiseData = async () => {
    try {
        const { data, error } = await supabase
            .from('services')
            .select('*, hotel_rooms(*)')
            .eq('type', 'cruise')
            .limit(2);

        if (error) throw error;

        console.log(JSON.stringify(data, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

fetchCruiseData();
