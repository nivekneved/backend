const supabase = require('../config/supabase');

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
exports.getPromotions = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active promotions only
// @route   GET /api/promotions/active
// @access  Public
exports.getActivePromotions = async (req, res) => {
    try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('promotions')
            .select('*')
            .eq('is_active', true)
            .or(`valid_until.is.null,valid_until.gte.${now}`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a promotion
// @route   POST /api/promotions
// @access  Private/Admin
exports.createPromotion = async (req, res) => {
    try {
        const { title, description, image, link, valid_until, is_active } = req.body;

        const { data, error } = await supabase
            .from('promotions')
            .insert([{
                title,
                description,
                image,
                link,
                valid_until: valid_until || null,
                is_active: is_active !== undefined ? is_active : true
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a promotion
// @route   PUT /api/promotions/:id
// @access  Private/Admin
exports.updatePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        const { data, error } = await supabase
            .from('promotions')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a promotion
// @route   DELETE /api/promotions/:id
// @access  Private/Admin
exports.deletePromotion = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('promotions')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
