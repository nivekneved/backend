const supabase = require('../backend/config/supabase');

const checkHeroSlides = async () => {
    try {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*');

        if (error) throw error;
        console.log('Hero Slides:', data);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

checkHeroSlides();
