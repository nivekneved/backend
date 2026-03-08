const supabase = require('../config/supabase');

// @desc    Get all approved reviews for a service
// @route   GET /api/services/:serviceId/reviews
// @access  Public
exports.getServiceReviews = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('service_id', req.params.serviceId)
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a review (Anonymous)
// @route   GET /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
    try {
        const { service_id, customer_name, rating, comment } = req.body;

        const { data, error } = await supabase
            .from('reviews')
            .insert([{
                service_id,
                customer_name,
                rating,
                comment,
                is_approved: false, // Requires moderation
                user_id: req.user.id // Link to authenticated user
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Moderate a review (Admin only)
// @route   PUT /api/admin/reviews/:id
// @access  Private/Admin
exports.moderateReview = async (req, res) => {
    try {
        const { is_approved } = req.body;
        const { id } = req.params;

        const { data, error } = await supabase
            .from('reviews')
            .update({ is_approved })
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Audit Logging
        try {
            await supabase.from('audit_logs').insert([{
                admin_id: req.admin.id,
                action: 'MODERATE_REVIEW',
                target_type: 'REVIEW',
                target_id: id,
                details: { is_approved },
                ip_address: req.ip
            }]);
        } catch (auditError) {
            console.error('Audit log error:', auditError.message);
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for moderation
// @route   GET /api/admin/reviews
// @access  Private/Admin
exports.getAllReviews = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*, services(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
