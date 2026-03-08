const supabase = require('../backend/config/supabase');

const checkHotelPolicies = async () => {
    try {
        console.log('--- Hotel Room Policies Audit ---');
        const { data: rooms, error } = await supabase
            .from('hotel_rooms')
            .select('id, name, policies, cancellation_policy, deposit_policy');

        if (error) throw error;

        console.log(`Checking ${rooms.length} hotel rooms...`);

        rooms.forEach(room => {
            const missing = [];
            if (!room.policies || (Array.isArray(room.policies) && room.policies.length === 0)) missing.push('policies');
            if (!room.cancellation_policy) missing.push('cancellation_policy');
            if (!room.deposit_policy) missing.push('deposit_policy');

            if (missing.length > 0) {
                console.log(`Room: ${room.name} (${room.id}) | Missing: ${missing.join(', ')}`);
            }
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkHotelPolicies();
