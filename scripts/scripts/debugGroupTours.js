const supabase = require('../backend/config/supabase');

const debugGroupTours = async () => {
    try {
        console.log('Querying: .or("category.eq.Group Tours,type.eq.group-tour")');
        const { data, error } = await supabase
            .from('services')
            .select('id, name, category, type, location, pricing, itinerary')
            .or('category.eq.Group Tours,type.eq.group-tour');

        if (error) throw error;

        console.log(`Results found: ${data.length}`);
        data.forEach(p => {
            const hasItinerary = p.itinerary && Array.isArray(p.itinerary) && p.itinerary.length > 0;
            console.log(`- ${p.name} | Has Itinerary: ${hasItinerary} (${p.itinerary?.length || 0} days)`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

debugGroupTours();
