
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from both possible locations
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../admin-app/.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const pages = [
    {
        slug: 'visa-services',
        title: 'Visa Services',
        content: {
            headline: 'Simplifying Your Travel Documents',
            body: '<p>Navigating visa requirements can be complex. At Travel Lounge, we provide expert assistance to ensure your travel documents are in order, whether you\'re traveling for business, leisure, or study.</p><ul><li>Expert guidance on visa requirements for various destinations.</li><li>Assistance with application forms and documentation.</li><li>Appointment scheduling and submission support.</li></ul>'
        }
    },
    {
        slug: 'transfers',
        title: 'Professional Transfers',
        content: {
            headline: 'Our Fleet & Services',
            body: '<p>Choose the perfect transport option for your journey. Experience a premium, safe, and reliable transfer service in Mauritius with our professional drivers.</p>'
        }
    },
    {
        slug: 'flights',
        title: 'Search Flights',
        content: {
            headline: 'Latest Flight Offers',
            body: '<p>Book your next journey with our exclusive flight offers and worldwide coverage. Exclusive deals managed by our travel experts.</p>'
        }
    },
    {
        slug: 'group-tours',
        title: 'Guided Group Tours',
        content: {
            headline: 'Guided Group Tours',
            body: '<p>Join our exclusive small-group journeys to the world\'s most breathtaking destinations. Travel with like-minded adventurers and create lasting friendships. Our local guides know the hidden gems and stories that you won\'t find in guidebooks.</p>'
        }
    },
    {
        slug: 'cruises',
        title: 'Cruise Vacations',
        content: {
            headline: 'Plan Your Dream Voyage',
            body: '<p>Sail through paradise with our curated luxury cruise experiences. Our cruise specialists are ready to help you choose the perfect cabin and itinerary.</p>'
        }
    },
    {
        slug: 'activities',
        title: 'Island Activities',
        content: {
            headline: 'Adventure Awaits',
            body: '<p>Discover the best adventures and experiences in Mauritius. From water sports and fishing to hiking and cycling, we offer a wide range of activities tailored to your interests.</p>'
        }
    },
    {
        slug: 'destinations',
        title: 'Dream Destinations',
        content: {
            headline: 'Explore the World',
            body: '<p>From tropical islands to vibrant cities, we offer all-inclusive packages with flights, accommodation, and unforgettable experiences. Let us handle every detail of your perfect getaway.</p>'
        }
    },
    {
        slug: 'contact',
        title: 'Contact Us',
        content: {
            headline: 'Get in Touch',
            body: '<p>We\'re here to help you plan your perfect trip. Reach out to us for any inquiries, bookings, or travel support. Our team of experts is available to assist you with everything from flight bookings to customized itineraries.</p>'
        }
    }
];

async function seedPages() {
    console.log('🚀 Seeding page content...');

    for (const page of pages) {
        const { data, error } = await supabase
            .from('pages')
            .upsert(page, { onConflict: 'slug' });

        if (error) {
            console.error(`❌ Error seeding ${page.slug}:`, error.message);
        } else {
            console.log(`✅ Seeded page: ${page.slug}`);
        }
    }

    console.log('✨ Seeding complete!');
}

seedPages();
