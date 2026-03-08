require('dotenv').config();
const supabase = require('./config/supabase');

async function test() {
    console.log("Testing supabase query for admin");
    try {
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', 'admin@travellounge.mu')
            .single();

        console.log("Result:", { admin, error });
    } catch (err) {
        console.error("Exception:", err);
    }
}
test();
