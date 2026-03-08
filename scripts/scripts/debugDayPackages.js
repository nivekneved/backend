const supabase = require('../backend/config/supabase');

const debugDayPackages = async () => {
    try {
        console.log('Querying: .or("category.eq.Day Package,type.eq.day-package")');
        const { data, error } = await supabase
            .from('services')
            .select('id, name, category, type, pricing, location')
            .or('category.eq.Day Package,type.eq.day-package');

        if (error) throw error;

        console.log(`Results found: ${data.length}`);
        data.forEach(p => {
            console.log(`- ${p.name} (Type: ${p.type}, Category: ${p.category}, Price: ${p.pricing?.base_price}, Location: ${p.location})`);
        });

        console.log('\nQuerying: .or("category.eq.Day Packages,type.eq.day-package") (Plural)');
        const { data: data2, error: error2 } = await supabase
            .from('services')
            .select('id, name, category, type')
            .or('category.eq.Day Packages,type.eq.day-package');

        if (error2) throw error2;
        console.log(`Results found (Plural): ${data2.length}`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

debugDayPackages();
