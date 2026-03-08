const supabase = require('../backend/config/supabase');

const auditServices = async () => {
    try {
        const { data: services, error } = await supabase
            .from('services')
            .select('id, name, type, category, itinerary, inclusions, highlights');

        if (error) throw error;

        console.log(`Total Services: ${services.length}`);

        const incomplete = services.filter(s =>
            !s.itinerary || (Array.isArray(s.itinerary) && s.itinerary.length === 0) ||
            !s.inclusions || (Array.isArray(s.inclusions) && s.inclusions.length === 0) ||
            !s.highlights || (Array.isArray(s.highlights) && s.highlights.length === 0)
        );

        console.log(`Incomplete Services: ${incomplete.length}`);
        incomplete.forEach(s => {
            const missing = [];
            if (!s.itinerary || (Array.isArray(s.itinerary) && s.itinerary.length === 0)) missing.push('itinerary');
            if (!s.inclusions || (Array.isArray(s.inclusions) && s.inclusions.length === 0)) missing.push('inclusions');
            if (!s.highlights || (Array.isArray(s.highlights) && s.highlights.length === 0)) missing.push('highlights');
            console.log(`- ${s.name} (${s.type}): Missing ${missing.join(', ')}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Audit failed:', err.message);
        process.exit(1);
    }
};

auditServices();
