const supabase = require('../backend/config/supabase');

const checkColumns = async () => {
    try {
        const { data, error } = await supabase
            .from('hotel_rooms')
            .select('*')
            .limit(1);

        if (error) throw error;

        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            console.log('Available columns in hotel_rooms:', keys.join(', '));
            const hasOccupancy = keys.includes('max_occupancy');
            const hasWeekend = keys.includes('weekend_price');
            console.log(`Has max_occupancy: ${hasOccupancy}`);
            console.log(`Has weekend_price: ${hasWeekend}`);
        } else {
            console.log('No data in hotel_rooms to check columns.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkColumns();
