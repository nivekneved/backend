const supabase = require('../backend/config/supabase');

const runMigration = async () => {
    try {
        console.log('Running migration: Add advanced room fields...');

        // Unfortunately, Supabase JS client doesn't support raw SQL easily unless we use RPC.
        // We can try to update an existing row to check if columns exist.

        const { error } = await supabase.rpc('exec_sql', {
            query_text: `
                ALTER TABLE hotel_rooms ADD COLUMN IF NOT EXISTS max_occupancy INTEGER DEFAULT 2;
                ALTER TABLE hotel_rooms ADD COLUMN IF NOT EXISTS weekend_price DECIMAL(10, 2);
            `
        });

        if (error) {
            console.error('Migration failed (RPC):', error.message);
            console.log('Checking if columns exist manually...');

            // Check by attempting to select them
            const { data, error: selectError } = await supabase
                .from('hotel_rooms')
                .select('max_occupancy, weekend_price')
                .limit(1);

            if (selectError) {
                console.error('Columns do not exist and RPC failed. Please run the SQL in Supabase dashboard:');
                console.log('ALTER TABLE hotel_rooms ADD COLUMN IF NOT EXISTS max_occupancy INTEGER DEFAULT 2;');
                console.log('ALTER TABLE hotel_rooms ADD COLUMN IF NOT EXISTS weekend_price DECIMAL(10, 2);');
                process.exit(1);
            } else {
                console.log('Columns already exist.');
            }
        } else {
            console.log('Migration successfully applied via RPC.');
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

runMigration();
