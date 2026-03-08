const supabase = require('../backend/config/supabase');

const updateHeroDatabase = async () => {
    try {
        console.log('Attempting to update hero_slides table...');

        // Bangkok update
        const { error: error1 } = await supabase
            .from('hero_slides')
            .update({ image_url: 'https://images.unsplash.com/photo-1563492065561-36d32ec4261e?q=80&w=1920' })
            .ilike('title', '%Bangkok%');

        if (error1) {
            console.log('Bangkok DB update failed or table missing:', error1.message);
        } else {
            console.log('Bangkok DB update check triggered.');
        }

        // Malaysia update
        const { error: error2 } = await supabase
            .from('hero_slides')
            .update({ image_url: 'https://images.unsplash.com/photo-1544918877-460635b6d13e?q=80&w=1920' })
            .ilike('title', '%Malaysia%');

        if (error2) {
            console.log('Malaysia DB update failed or table missing:', error2.message);
        } else {
            console.log('Malaysia DB update check triggered.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

updateHeroDatabase();
