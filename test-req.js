const axios = require('axios');
require('dotenv').config();

async function run() {
    try {
        const res = await axios.post('http://localhost:5000/api/admin/login', {
            email: 'admin@travellounge.mu',
            password: 'password'
        });
        console.log("Success:", res.data);
    } catch (e) {
        console.error("Error Status:", e.response?.status);
        console.error("Error Data:", e.response?.data);
    }
}
run();
