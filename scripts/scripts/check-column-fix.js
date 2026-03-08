const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const applyFix = async () => {
    console.log('Applying display_order column fix...');

    // We can't run raw SQL directly through the client unless there's an RPC.
    // However, some setups have a 'exec_sql' or similar RPC.
    // Let's try to just check if the column exists first by attempting a select.

    const { error: selectError } = await supabase
        .from('services')
        .select('display_order')
        .limit(1);

    if (selectError && selectError.message.includes('column services.display_order does not exist')) {
        console.log('Confirmed: display_order column is missing.');
        console.log('Attempting to apply fix via RPC if available...');

        // If there's an RPC named 'execute_sql' we could try it.
        // But usually there isn't.
        // Let's check if the user has any existing sql-running scripts.
        console.log('Please apply the following SQL manually in the Supabase Dashboard SQL Editor:');
        console.log('ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;');
        console.log('ALTER TABLE services ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;');
    } else if (selectError) {
        console.error('Unexpected error:', selectError.message);
    } else {
        console.log('✓ column display_order already exists.');
    }
};

applyFix();
