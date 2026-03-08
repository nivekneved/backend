require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service key for admin access

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    console.log('URL:', supabaseUrl);
    console.log('KEY:', supabaseKey ? 'Set' : 'Missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmin() {
    console.log('Checking admin user...');

    const { data: admin, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', 'admin@travellounge.mu')
        .single();

    if (error) {
        console.error('Error fetching admin:', error);
        return;
    }

    if (!admin) {
        console.log('Admin not found in DB');
        return;
    }

    console.log('Admin found:', admin.email);
    console.log('Stored hash:', admin.password);

    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
        console.error('ERROR: ADMIN_PASSWORD environment variable is not set.');
        return;
    }

    // Generate new hash
    const newHash = await bcrypt.hash(password, 12);
    console.log('Generated new hash:', newHash);

    // Update the user
    const { error: updateError } = await supabase
        .from('admins')
        .update({ password: newHash })
        .eq('email', 'admin@travellounge.mu');

    if (updateError) {
        console.error('Failed to update password:', updateError);
    } else {
        console.log('Successfully updated password in DB');
    }

    // Verify
    const { data: updatedUser } = await supabase
        .from('admins')
        .select('password')
        .eq('email', 'admin@travellounge.mu')
        .single();

    const isMatchNow = await bcrypt.compare(password, updatedUser.password);
    console.log('Verification after update:', isMatchNow);
}

checkAdmin();
