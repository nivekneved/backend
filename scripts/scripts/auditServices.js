const supabase = require('../backend/config/supabase');

const auditServices = async () => {
    try {
        console.log('--- Services Data Audit ---');
        const { data: services, error } = await supabase
            .from('services')
            .select('*');

        if (error) throw error;

        console.log(`Auditing ${services.length} services...`);

        const report = {
            total: services.length,
            missing_itinerary: 0,
            missing_inclusions: 0,
            missing_features: 0,
            missing_highlights: 0,
            by_type: {}
        };

        services.forEach(s => {
            if (!report.by_type[s.type]) report.by_type[s.type] = { total: 0, missing_itinerary: 0, missing_inclusions: 0 };
            report.by_type[s.type].total++;

            let isMissing = false;
            if (!s.itinerary || (Array.isArray(s.itinerary) && s.itinerary.length === 0)) {
                report.missing_itinerary++;
                report.by_type[s.type].missing_itinerary++;
                isMissing = true;
            }
            if (!s.inclusions || (Array.isArray(s.inclusions) && s.inclusions.length === 0)) {
                report.missing_inclusions++;
                report.by_type[s.type].missing_inclusions++;
                isMissing = true;
            }

            if (isMissing) {
                // console.log(`[${s.type}] ${s.name} | Missing: ${!s.itinerary ? 'itinerary ' : ''}${!s.inclusions ? 'inclusions' : ''}`);
            }
        });

        console.log('\n--- Audit Report ---');
        console.log(JSON.stringify(report, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

auditServices();
