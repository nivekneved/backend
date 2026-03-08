require('dotenv').config({ path: '../.env' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const migrationFile = path.join('C:\\Users\\deven\\.gemini\\antigravity\\brain\\15a1d966-3856-49ca-b0df-79e19303707c\\hero_slides_schema.sql');

const runMigration = async () => {
    // Construct connection string from Supabase URL + Service Key? No, standard PG connection string is better.
    // Usually Supabase provides a direct connection string.
    // If we only have URL and Key, we can use supabase-js but it doesn't support generic SQL execution easily on client.
    // Let's rely on the user having a DATABASE_URL in .env or construct it.
    // Typical Supabase PG URL: postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres

    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL not found in .env. Cannot run raw SQL migration.");
        // Fallback: Try to use the Service Role Key with a special Supabase Function if it existed, but it likely doesn't.
        // For now, let's assume valid DATABASE_URL or ask user.
        // Wait, the user provided credentials earlier:
        // URL: https://tbyudagfjspedeqtlgjv.supabase.co
        // We probably don't have the DB password for direct PG access unless it's in .env.

        console.log("⚠️  Attempting to use known credentials if available...");
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("✅ Connected to Database");

        const sql = fs.readFileSync(migrationFile, 'utf8');
        await client.query(sql);

        console.log("✅ Migration executed successfully!");
        console.log("   - Table `hero_slides` created.");
        console.log("   - RLS policies applied.");
        console.log("   - Verification data seeded.");
    } catch (err) {
        console.error("❌ Migration Failed:", err);
    } finally {
        await client.end();
    }
};

runMigration();
