const supabase = require('../backend/config/supabase');

const runMigration = async () => {
    try {
        console.log('--- Applying Schema Changes ---');

        // 1. DDL updates via RPC or execute_sql (if available) - standard supabase-js doesn't have DDL unless via RPC.
        // However, we can try to standardizing the data first, and for DDL we might need the MCP tool to work.
        // Let's try to do the standardization first as that's just UI fix.

        console.log('--- Standardizing Data ---');

        // Sea Activities
        const { error: err1 } = await supabase.from('services').update({ category: 'Sea Activities' }).in('category', ['Water Activities', 'water']);
        if (err1) console.error('Error standardizing Sea Activities:', err1.message);

        // Land Activities
        const { error: err2 } = await supabase.from('services').update({ category: 'Land Activities' }).in('category', ['land']);
        if (err2) console.error('Error standardizing Land Activities:', err2.message);

        // Day Packages
        const { error: err3 } = await supabase.from('services').update({ category: 'Day Packages' }).in('category', ['Day Package']);
        if (err3) console.error('Error standardizing Day Packages:', err3.message);

        // Types
        const { error: err4 } = await supabase.from('services').update({ type: 'activity' }).in('type', ['land', 'water', 'Excursion', 'Wildlife']);
        if (err4) console.error('Error standardizing Activity types:', err4.message);

        const { error: err5 } = await supabase.from('services').update({ type: 'day-package' }).eq('category', 'Day Packages');
        if (err5) console.error('Error standardizing Day Package types:', err5.message);

        const { error: err6 } = await supabase.from('services').update({ type: 'transfer' }).eq('type', 'transport');
        if (err6) console.error('Error standardizing Transfer types:', err6.message);

        const { error: err7 } = await supabase.from('services').update({ type: 'package' }).eq('category', 'Destination');
        if (err7) console.error('Error standardizing Package types:', err7.message);

        const { error: err8 } = await supabase.from('services').update({ type: 'tour' }).eq('category', 'Group Tours');
        if (err8) console.error('Error standardizing Tour types:', err8.message);

        const { error: err9 } = await supabase.from('services').update({ type: 'hotel' }).in('category', ['hotels', 'Rodrigues']);
        if (err9) console.error('Error standardizing Hotel types:', err9.message);

        console.log('Standardization complete.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err.message);
        process.exit(1);
    }
};

runMigration();
