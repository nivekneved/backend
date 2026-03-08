const axios = require('axios');

const check = async () => {
    try {
        console.log('🔍 Checking API for rich content...');
        const response = await axios.get('http://localhost:5000/api/services?search=Honeymoon');

        const product = response.data.find(p => p.name.includes('Honeymoon'));

        if (!product) {
            console.error('❌ "Honeymoon Bliss" package not found in API response.');
            return;
        }

        console.log('✅ Product Found:', product.name);

        // Check Itinerary
        if (product.itinerary && Array.isArray(product.itinerary) && product.itinerary.length > 0) {
            console.log(`✅ Itinerary has ${product.itinerary.length} days.`);
            console.log('   Sample Day:', product.itinerary[0].title);
        } else {
            console.error('❌ Itinerary is missing or empty.');
        }

        // Check Images
        if (product.images && product.images.length > 0) {
            console.log(`✅ Gallery has ${product.images.length} images.`);
        } else {
            console.error('❌ Images are missing.');
        }

        // Check Pricing
        if (product.pricing) {
            console.log(`✅ Pricing: ${product.pricing.currency} ${product.pricing.basePrice}`);
        } else {
            console.error('❌ Pricing is missing.');
        }

    } catch (error) {
        console.error('❌ API Error:', error.message);
    }
};

check();
