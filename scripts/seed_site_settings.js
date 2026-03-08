
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const offices = [
    {
        name: "Port Louis Office",
        address: "Ground Floor Newton Tower,\nCorner Sir William Newton &\nRemy Ollier Street,\nPort Louis, Mauritius",
        phones: ["(+230) 212 4070", "(+230) 212 4073"],
        map_link: "https://maps.google.com/?q=Travel+Lounge+Port+Louis"
    },
    {
        name: "Ebene Office",
        address: "Ground Floor, 57 Ebene Mews,\nRue Du Savoir,\nEbene Cybercity,\nMauritius",
        phones: ["(+230) 5940 7711", "(+230) 5940 7701"],
        map_link: "https://maps.google.com/?q=Travel+Lounge+Ebene"
    }
];

async function seedSettings() {
    console.log('🚀 Seeding site settings...');

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            key: 'office_locations',
            value: offices,
            category: 'footer'
        }, { onConflict: 'key' });

    if (error) {
        console.error('❌ Error seeding office_locations:', error.message);
    } else {
        console.log('✅ Seeded office_locations');
    }

    // Also ensure contact info is synced
    const contactInfo = [
        { key: 'contact_phone', value: '+230 212 4070', category: 'header' },
        { key: 'contact_email', value: 'reservation@travellounge.mu', category: 'header' },
        { key: 'facebook_url', value: 'https://facebook.com/travellounge.mu', category: 'social' },
        { key: 'instagram_url', value: 'https://instagram.com/travellounge.mu', category: 'social' }
    ];

    for (const info of contactInfo) {
        await supabase.from('site_settings').upsert(info, { onConflict: 'key' });
    }

    console.log('✨ Site settings seeded!');
}

seedSettings();
