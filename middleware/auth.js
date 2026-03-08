const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes using Supabase Authentication.
 * This verifies the JWT sent from the frontend against Supabase.
 */
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token provided' });

    try {
        const token = authHeader.split(' ')[1];

        // 1. Try Custom Backend JWT (Admins)
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded && decoded.id) {
                const { data: admin, error: adminError } = await supabase
                    .from('admins')
                    .select('*')
                    .eq('id', decoded.id)
                    .single();

                if (!adminError && admin) {
                    req.user = { id: admin.id, email: admin.email, role: admin.role, username: admin.username };
                    req.admin = req.user;
                    return next();
                }
            }
        } catch (err) {
            // Not a custom JWT or verification failed, continue to Supabase check
        }

        // 2. Try Supabase Auth Token
        const { data: { user }, error: supabaseError } = await supabase.auth.getUser(token);

        if (supabaseError || !user) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const role = user.app_metadata?.role || 'customer';
        req.user = { id: user.id, email: user.email, role, metadata: user.user_metadata };

        // Admin/Staff compatibility
        if (['admin', 'staff'].includes(role)) {
            req.admin = { ...req.user, username: user.user_metadata?.username || user.email.split('@')[0] };
        }

        next();
    } catch (_) {
        res.status(401).json({ message: 'Auth failed' });
    }
};

const authorize = (...roles) => (req, res, next) => {
    const role = req.user?.role || req.admin?.role;
    if (!roles.includes(role)) return res.status(403).json({ message: `Role ${role} unauthorized` });
    next();
};

module.exports = { protect, authorize };
