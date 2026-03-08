const supabase = require('../backend/config/supabase');

const listRooms = async () => {
    try {
        const { data, error } = await supabase.from('hotel_rooms').select('*');
        if (error) throw error;

        console.log(`Found ${data.length} rooms.`);
        data.forEach(r => {
            console.log(`- ${r.name} (id: ${r.id}): Policies: ${r.policies?.length || 0}, Cancellation: ${r.cancellation_policy}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('List failed:', err.message);
        process.exit(1);
    }
};

listRooms();
