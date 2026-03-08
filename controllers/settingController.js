const supabase = require('../config/supabase');

// @desc    Get all settings
// @route   GET /api/admin/settings
// @access  Private/Admin
exports.getSettings = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('*');

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a setting
// @route   PUT /api/admin/settings/:key
// @access  Private/Admin
exports.updateSetting = async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    try {
        const { data, error } = await supabase
            .from('settings')
            .upsert({ key, value }, { onConflict: 'key' })
            .select()
            .single();

        if (error) throw error;

        // Audit Logging
        try {
            await supabase.from('audit_logs').insert([{
                admin_id: req.admin.id,
                action: 'UPDATE_SETTING',
                target_type: 'SYSTEM',
                details: { key, value },
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
