const supabase = require('../backend/config/supabase');

const fixPolicies = async () => {
    try {
        const standardPolicies = ['No smoking in rooms', 'Check-out: 11:00 AM', 'No pets', 'Quiet hours after 10 PM'];

        const { data: rooms } = await supabase.from('hotel_rooms').select('id');
        for (const room of rooms) {
            // Using JSON.stringify or just the array - trial and error if one failed
            const { error } = await supabase.from('hotel_rooms').update({
                policies: standardPolicies
            }).eq('id', room.id);
            if (error) console.error(error.message);
        }
        console.log('Policies fix applied.');
        process.exit(0);
    } catch (err) {
        process.exit(1);
    }
};

fixPolicies();
