const supabase = require('../backend/config/supabase');

const inspectHotelRooms = async () => {
    try {
        const { data, error } = await supabase
            .from('hotel_rooms')
            .select('*')
            .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
            console.log('Sample Data from hotel_rooms:');
            console.log(JSON.stringify(data[0], null, 2));
        } else {
            console.log('No data found in hotel_rooms table.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

inspectHotelRooms();
