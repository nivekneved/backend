const supabase = require('../backend/config/supabase');

const listTables = async () => {
    try {
        // We can't query information_schema directly via PostgREST easily.
        // But we can try to guess or use a common table like 'services' and see if it has links.
        // Better: Try to run a simple RPC if available, or just try common names.

        console.log('Common names check:');
        const commonNames = ['services', 'hotel_rooms', 'categories', 'bookings', 'users', 'reviews', 'hero_slides', 'menus'];
        for (const name of commonNames) {
            const { data, error } = await supabase.from(name).select('count(*)').limit(1);
            if (!error) {
                console.log(`- ${name}: exists`);
            }
        }

        process.exit(0);
    } catch (err) {
        console.log('Error:', err.message);
        process.exit(1);
    }
};

listTables();
