const supabase = require('../config/supabase');

// Get All Active Slides (Public)
exports.getHeroSlides = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .eq('is_active', true)
            .order('order_index', { ascending: true });

        if (error) {
            // If table doesn't exist yet, return static fallback/empty array gracefully
            if (error.code === '42P01') { // undefined_table
                console.warn("Hero Slides table missing returning empty.");
                return res.status(200).json([]);
            }
            throw error;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching hero slides:', error);
        res.status(500).json({ message: 'Error fetching slides', error: error.message });
    }
};

// Admin: Create Slide
exports.createSlide = async (req, res) => {
    try {
        const { image_url, title, subtitle, description, cta_text, cta_link, order_index } = req.body;

        const { data, error } = await supabase
            .from('hero_slides')
            .insert([{
                image_url,
                title,
                subtitle,
                description,
                cta_text,
                cta_link,
                order_index: order_index || 0
            }])
            .select();

        if (error) throw error;
        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating slide', error: error.message });
    }
};

// Admin: Update Slide
exports.updateSlide = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('hero_slides')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating slide', error: error.message });
    }
};

// Admin: Delete Slide
exports.deleteSlide = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('hero_slides')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'Slide deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting slide', error: error.message });
    }
};
