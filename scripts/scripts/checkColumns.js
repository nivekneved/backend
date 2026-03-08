const supabase = require('../backend/config/supabase');

const checkColumns = async () => {
    try {
        console.log('--- Checking Services Columns ---');
        const { data, error } = await supabase.from('services').select('*').limit(1);
        if (error) throw error;

        if (data && data.length > 0) {
            console.log('Columns found:', Object.keys(data[0]).join(', '));
        } else {
            console.log('No data found in services table to check columns.');
        }

        console.log('\n--- Checking Hotel Rooms Columns ---');
        const { data: rooms, error: roomError } = await supabase.from('hotel_rooms').select('*').limit(1);
        if (roomError) {
            console.log('Error checking hotel_rooms columns (maybe table empty?):', roomError.message);
        } else if (rooms && rooms.length > 0) {
            console.log('Columns found:', Object.keys(rooms[0]).join(', '));
        }

        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err.message);
        process.exit(1);
    }
};

checkColumns();
