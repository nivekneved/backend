const supabase = require('../backend/config/supabase');

const enrichRoomsFinal = async () => {
    try {
        console.log('--- Final Hotel Room Policies Enrichment ---');
        const cancellation = 'Full refund if cancelled 48 hours before arrival. 100% charge for no-shows.';
        const deposit = 'A 20% non-refundable deposit is required to secure the booking.';

        const { data: rooms, error: fetchErr } = await supabase.from('hotel_rooms').select('id');
        if (fetchErr) throw fetchErr;

        for (const room of rooms) {
            const { error } = await supabase
                .from('hotel_rooms')
                .update({
                    cancellation_policy: cancellation,
                    deposit_policy: deposit
                })
                .eq('id', room.id);

            if (error) {
                console.error(`Error enriching room ${room.id}: ${error.message}`);
            }
        }

        console.log('Successfully enriched all hotel rooms with cancellation and deposit policies.');
        process.exit(0);
    } catch (err) {
        console.error('Enrichment failed:', err.message);
        process.exit(1);
    }
};

enrichRoomsFinal();
