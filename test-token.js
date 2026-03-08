require('dotenv').config();
const jwt = require('jsonwebtoken');

function testToken() {
    console.log("JWT_SECRET is:", process.env.JWT_SECRET ? "Present" : "Missing");
    try {
        const token = jwt.sign({ id: '1fe8edb4-0551-4199-a959-aaaa16abf012' }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        console.log("Token generated:", token.substring(0, 10) + '...');
    } catch (e) {
        console.error("Token error:", e);
    }
}
testToken();
