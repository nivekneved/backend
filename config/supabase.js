const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
    console.warn('WARNING: Supabase URL or Key missing in .env file. Using mock client.');

    // Create a mock client for development purposes
    supabase = {
        from: () => {
            const chain = {
                select: () => chain,
                insert: () => chain,
                update: () => chain,
                delete: () => chain,
                eq: () => chain,
                neq: () => chain,
                lte: () => chain,
                lt: () => chain,
                order: () => chain,
                limit: () => chain,
                single: () => Promise.resolve({ data: null, error: { message: 'Mock Client: Env variables missing' } }),
                then: (resolve) => resolve({ data: [], error: { message: 'Mock Client: Env variables missing' } })
            };
            return chain;
        },
        auth: {
            signUp: () => ({ data: {}, error: null }),
            signInWithPassword: () => ({ data: {}, error: null }),
            signOut: () => Promise.resolve(),
            getUser: () => ({ data: { user: null }, error: null })
        },
        getUser: () => ({ data: { user: null }, error: null })
    };
} else {
    supabase = createClient(supabaseUrl, supabaseKey);
}

module.exports = supabase;
module.exports.supabaseUrl = supabaseUrl;
module.exports.supabaseKey = supabaseKey;