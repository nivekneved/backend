const supabase = require('../backend/config/supabase');

const seedTeam = async () => {
    try {
        console.log('Seeding authentic team members...');

        // 1. Clear existing
        const { error: deleteError } = await supabase
            .from('team_members')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

        if (deleteError) throw deleteError;

        // 2. Insert authentic team members
        const teamData = [
            {
                name: 'Leena Jhugroo',
                role: 'Managing Director',
                bio: 'Visionary leader with extensive experience in the travel industry, dedicated to providing premium travel experiences for Mauritian and international travelers.',
                email: 'reservations@travellounge.mu',
                is_active: true,
                display_order: 1
            },
            {
                name: 'Nalini Indurjeet',
                role: 'Senior Sales Executive Corporate',
                bio: 'Excellence in corporate travel management, ensuring seamless business trips and personalized service for our corporate partners.',
                email: 'reservations@travellounge.mu',
                is_active: true,
                display_order: 2
            },
            {
                name: 'Nabila Ramjaun',
                role: 'Senior Sales Executive Corporate',
                bio: 'Specialist in tailor-made corporate solutions with a focus on efficiency and high-quality service standards.',
                email: 'reservations@travellounge.mu',
                is_active: true,
                display_order: 3
            },
            {
                name: 'Kirtee Boodoo',
                role: 'Senior Sales Executive Leisure',
                bio: 'Passionate about crafting the perfect holiday experience, from luxury escapes to family adventures.',
                email: 'reservations@travellounge.mu',
                is_active: true,
                display_order: 4
            },
            {
                name: 'Maleekah Amboorallee',
                role: 'Travel Consultant',
                bio: 'Expert travel advisor dedicated to finding the best deals and providing exceptional support to all our clients.',
                email: 'reservations@travellounge.mu',
                is_active: true,
                display_order: 5
            },
            {
                name: 'Manshi Rughoobur',
                role: 'Account Clerk',
                bio: 'Ensuring administrative excellence and financial integrity within our travel operations.',
                email: 'reservations@travellounge.mu',
                is_active: true,
                display_order: 6
            },
            {
                name: 'Mandini Boolauk',
                role: 'Travel Consultant',
                bio: 'Committed to delivering personalized advice and support for memorable travel journeys.',
                email: 'reservations@travellounge.mu',
                is_active: true,
                display_order: 7
            }
        ];

        const { data, error } = await supabase
            .from('team_members')
            .insert(teamData)
            .select();

        if (error) throw error;
        console.log('Successfully seeded team members:', data.length);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding team:', err.message);
        process.exit(1);
    }
};

seedTeam();
