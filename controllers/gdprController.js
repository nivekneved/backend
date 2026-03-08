const supabase = require('../config/supabase');

// @desc    Get user data by email/phone (manual support request)
// @route   GET /api/admin/gdpr/user-data
// @access  Private/Admin
exports.getUserData = async (req, res) => {
    const { email, phone } = req.query;
    try {
        if (!email && !phone) {
            return res.status(400).json({ message: 'Email or Phone is required' });
        }

        // Search in bookings (primary data source for anonymous users)
        const query = supabase.from('bookings').select('*');
        if (email) query.eq('customer->email', email);
        if (phone) query.eq('customer->phone', phone);

        const { data, error } = await query;
        if (error) throw error;

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user data (manual support request - GDPR Right to Erasure)
// @route   DELETE /api/admin/gdpr/user-data
// @access  Private/Admin
exports.deleteUserData = async (req, res) => {
    const { email, phone } = req.query;
    try {
        if (!email && !phone) {
            return res.status(400).json({ message: 'Email or Phone is required' });
        }

        const query = supabase.from('bookings').delete({ count: 'exact' });
        if (email) query.eq('customer->email', email);
        if (phone) query.eq('customer->phone', phone);

        const { error, count } = await query;
        if (error) throw error;

        // Audit Log
        await supabase.from('audit_logs').insert([{
            admin_id: req.admin.id,
            action: 'GDPR_DATA_ERASURE',
            target_type: 'USER_DATA',
            details: { email, phone, deletedCount: count },
            ip_address: req.ip
        }]);

        res.json({ success: true, count });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
