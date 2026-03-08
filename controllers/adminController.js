const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Auth admin & get token
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            // Audit Log
            try {
                await supabase.from('audit_logs').insert([{
                    admin_id: admin.id,
                    action: 'LOGIN',
                    target_type: 'AUTH',
                    ip_address: req.ip
                }]);
            } catch (auditError) {
                console.error('Audit log error:', auditError.message);
            }

            res.json({
                _id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin.id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create first admin (Development only)
// @route   POST /api/admin/setup
// @access  Disabled in Production
exports.setup = async (req, res) => {
    return res.status(403).json({ message: 'Setup endpoint disabled for security.' });
};
