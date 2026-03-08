const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function main() {
    const email = 'admin@travellounge.mu';
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
        console.error('ERROR: ADMIN_PASSWORD environment variable is not set.');
        process.exit(1);
    }

    console.log(`Checking for user: ${email}`);

    try {
        const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

        if (listError) {
            console.error('Error listing users:', listError.message);
            process.exit(1);
        }

        const existingUser = users.find(u => u.email === email);

        if (existingUser) {
            console.log('User exists, updating password and confirming email...');
            const { error: updateError } = await supabase.auth.admin.updateUserById(existingUser.id, {
                password: password,
                email_confirm: true
            });
            if (updateError) throw updateError;
            console.log('Admin account updated successfully.');
        } else {
            console.log('User does not exist, creating new admin account...');
            const { error: createError } = await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: { role: 'admin' }
            });
            if (createError) throw createError;
            console.log('Admin account created successfully.');
        }

        // Also ensure profile exists if there's a profiles table
        console.log('Ensuring profile exists...');
        const { data: profileCheck } = await supabase.from('profiles').select('*').eq('email', email).single();
        if (!profileCheck) {
            // If profile doesn't exist, we might need a user ID from the newly created auth user
            const { data: { users: updatedUsers } } = await supabase.auth.admin.listUsers();
            const user = updatedUsers.find(u => u.email === email);
            if (user) {
                await supabase.from('profiles').insert([{
                    id: user.id,
                    email: email,
                    role: 'admin',
                    full_name: 'System Admin'
                }]);
                console.log('Profile created.');
            }
        } else {
            await supabase.from('profiles').update({ role: 'admin' }).eq('email', email);
            console.log('Profile role updated to admin.');
        }

    } catch (err) {
        console.error('Operation failed:', err.message);
        process.exit(1);
    }

    process.exit(0);
}

main();
