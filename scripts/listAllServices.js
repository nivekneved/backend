const axios = require('axios');

const list = async () => {
    try {
        console.log('🔍 Listing all services...');
        const response = await axios.get('http://localhost:5000/api/services');

        if (response.data.length === 0) {
            console.log('⚠️ No services found in API.');
        } else {
            const uniqueCategories = [...new Set(response.data.map(p => p.category))];
            console.log('\n📊 Unique Categories:');
            uniqueCategories.forEach(c => console.log(` - '${c}'`));

            response.data.forEach(p => {
                console.log(` - [${p.id}] '${p.name}' (Category: '${p.category}')`);
            });
        }
    } catch (error) {
        console.error('❌ API Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error config:', error.config);
        }
    }
};

list();
