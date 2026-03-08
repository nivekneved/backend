
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSettings() {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) {
        console.error('Error fetching settings:', error.message);
    } else {
        console.log('--- Site Settings Keys ---');
        data.forEach(item => {
            if (item.key === 'office_locations') {
                console.log('--- Office Locations ---');
                console.log(JSON.stringify(item.value, null, 2));
            }
            console.log(`- ${item.key}: ${typeof item.value === 'string' ? item.value.substring(0, 50) : 'object'}`);
        });
    }
}

checkSettings();
