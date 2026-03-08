require('dotenv').config();
const supabase = require('./config/supabase');

async function checkAdmins() {
    const { data: admins, error } = await supabase.from('admins').select('email, password');
    console.log(admins);
}
checkAdmins();
