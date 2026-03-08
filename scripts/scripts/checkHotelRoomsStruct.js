const supabase = require('../backend/config/supabase');

const checkHotelRooms = async () => {
    try {
        console.log('--- Checking hotel_rooms Structure ---');
        // Fetch one row
        const { data, error } = await supabase.from('hotel_rooms').select('*').limit(1);
        if (error) {
            console.error('Error fetching hotel_rooms:', error.message);
            process.exit(1);
        }

        if (data && data.length > 0) {
            const columns = Object.keys(data[0]);
            console.log('Columns in hotel_rooms:', columns.join(', '));

            // Specifically check for our new columns
            const targetCols = ['policies', 'cancellation_policy', 'deposit_policy'];
            targetCols.forEach(col => {
                console.log(`Column "${col}" exists: ${columns.includes(col)}`);
            });
        } else {
            console.log('hotel_rooms table is empty. Cannot determine columns via select *.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Script failed:', err.message);
        process.exit(1);
    }
};

checkHotelRooms();
