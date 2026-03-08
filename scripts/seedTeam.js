const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const teamMembers = [
    {
        name: 'Sarah Jenkins',
        role: 'Founder & CEO',
        bio: 'With over 20 years in luxury travel, Sarah founded Travel Lounge to bring a personal touch to island getaways. She believes every trip should be a masterpiece.',
        photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        display_order: 1
    },
    {
        name: 'David Chen',
        role: 'Head of Operations',
        bio: 'David ensures every logistical detail is perfect. His background in hospitality management means he knows exactly what goes into a seamless experience.',
        photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        display_order: 2
    },
    {
        name: 'Amara Patel',
        role: 'Senior Travel Designer',
        bio: 'Amara specializes in curating bespoke itineraries. Her passion for culture and local hidden gems transforms ordinary trips into extraordinary journeys.',
        photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        display_order: 3
    },
    {
        name: 'James Wilson',
        role: 'Concierge Manager',
        bio: 'James is your go-to for the impossible. From last-minute reservations to private yacht charters, he makes magic happen for our clients.',
        photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        display_order: 4
    },
    {
        name: 'Elena Rodriguez',
        role: 'Wedding & Events Specialist',
        bio: 'Elena has planned over 500 destination weddings. She turns your dream celebration into reality with precision, creativity, and calm.',
        photo_url: 'https://images.unsplash.com/photo-1534751516015-0d400688c6b5?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        display_order: 5
    },
    {
        name: 'Michael Ross',
        role: 'Adventure Expert',
        bio: 'An avid explorer himself, Michael designs thrill-seeking adventures. Whether it\'s hiking Le Morne or deep-sea fishing, he knows the best spots.',
        photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop',
        is_active: true,
        display_order: 6
    }
];

const seedTeam = async () => {
    try {
        console.log('Clearing existing team members...');
        const { error: deleteError } = await supabase.from('team_members').delete().neq('id', 0); // Delete all
        if (deleteError) console.warn('Error clearing table (might be empty or RLS):', deleteError.message);

        console.log('Seeding team members...');
        const { data, error } = await supabase.from('team_members').insert(teamMembers).select();

        if (error) {
            console.error('Error seeding team members:', error);
        } else {
            console.log('Successfully seeded team members:', data.length);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
};

seedTeam();
