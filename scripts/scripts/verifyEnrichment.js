const supabase = require('../backend/config/supabase');

const verifyEnrichment = async () => {
    try {
        console.log('--- Verifying Service Enrichment ---');
        const { data: service, error: sError } = await supabase
            .from('services')
            .select('*')
            .eq('name', 'Sunset Catamaran Cruise')
            .single();

        if (sError) throw sError;
        console.log('Service:', service.name);
        console.log('Itinerary length:', service.itinerary?.length || 0);
        console.log('Inclusions length:', service.inclusions?.length || 0);
        console.log('Category:', service.category);

        console.log('\n--- Verifying Hotel Room Enrichment ---');
        const { data: room, error: rError } = await supabase
            .from('hotel_rooms')
            .select('*')
            .limit(1)
            .single();

        if (rError) throw rError;
        console.log('Room:', room.name);
        console.log('Policies length:', room.policies?.length || 0);
        console.log('Cancellation Policy:', room.cancellation_policy);

        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err.message);
        process.exit(1);
    }
};

verifyEnrichment();
