const axios = require('axios');

async function testEmpty() {
    try {
        const res = await axios.post('http://localhost:5000/api/admin/login', {});
        console.log("Success:", res.data);
    } catch (e) {
        console.error("Error Status:", e.response?.status);
        console.error("Error Data:", e.response?.data);
    }
}
testEmpty();
