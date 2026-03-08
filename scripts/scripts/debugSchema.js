const supabase = require('../backend/config/supabase');

const checkColumns = async () => {
    try {
        const { data, error } = await supabase
            .rpc('get_table_columns', { table_name: 'categories' });

        if (error) {
            // If RPC doesn't exist, try a direct query to information_schema if permitted via API
            // Usually not. Let's try to just insert a dummy and see the error message detail.
            console.log('Trying to insert dummy to see error...');
            const { error: insError } = await supabase.from('categories').insert({ name: 'Test' });
            console.log('Insert error detail:', insError);
        } else {
            console.log('Columns:', data);
        }
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkColumns();
