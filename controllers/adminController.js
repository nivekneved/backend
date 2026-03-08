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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const { data: admin, error } = await supabase
            .from('admins')
            .select('*')
            .eq('email', email)
            .single();

        if (error || !admin) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!admin.password) {
            console.error('Admin record is missing a password hash in the database.');
            return res.status(500).json({ message: 'Server misconfiguration: admin missing password hash' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            // Audit Log
            try {
                await supabase.from('audit_logs').insert([{
                    admin_id: admin.id,
                    action: 'LOGIN',
                    target_type: 'AUTH',
                    ip_address: req.ip || 'unknown'
                }]);
            } catch (auditError) {
                console.error('Audit log error:', auditError?.message || auditError);
            }

            if (!process.env.JWT_SECRET) {
                console.error('CRITICAL: JWT_SECRET environment variable is missing.');
                return res.status(500).json({ message: 'Server configuration error: JWT_SECRET missing' });
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
        console.error('Login Exception:', error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
};

// @desc    Create first admin (Development only)
// @route   POST /api/admin/setup
// @access  Disabled in Production
exports.setup = async (req, res) => {
    return res.status(403).json({ message: 'Setup endpoint disabled for security.' });
};
