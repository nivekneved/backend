const supabase = require('../backend/config/supabase');

const listGaps = async () => {
    try {
        console.log('--- Services Missing Itineraries ---');
        const { data: services, error: sError } = await supabase
            .from('services')
            .select('id, name, category')
            .or('itinerary.is.null,itinerary.eq.[]')
            .not('category', 'eq', 'hotels'); // Hotels usually don't have itineraries in this schema

        if (sError) throw sError;
        services.forEach(s => console.log(`${s.name} | ${s.category} | ${s.id}`));

        console.log('\n--- Hotel Rooms Missing Policies ---');
        const { data: rooms, error: rError } = await supabase
            .from('hotel_rooms')
            .select('id, name, cancellation_policy, deposit_policy')
            .or('cancellation_policy.is.null,deposit_policy.is.null');

        if (rError) throw rError;
        rooms.forEach(r => console.log(`${r.name} | ${r.id} | Cancel: ${r.cancellation_policy ? 'OK' : 'MISSING'} | Deposit: ${r.deposit_policy ? 'OK' : 'MISSING'}`));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

listGaps();
