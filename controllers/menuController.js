const supabase = require('../config/supabase');

// @desc    Get all menus
// @route   GET /api/menus
// @access  Public
exports.getMenus = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menus')
            .select('*')
            .order('title', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get menu by location
// @route   GET /api/menus/:location
// @access  Public
exports.getMenuByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const { data, error } = await supabase
            .from('menus')
            .select('*')
            .eq('location', location)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

        if (!data) {
            return res.status(404).json({ message: 'Menu not found' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Initialize/Create a menu
// @route   POST /api/menus
// @access  Private/Admin
exports.createMenu = async (req, res) => {
    try {
        const { title, location, items } = req.body;

        const { data, error } = await supabase
            .from('menus')
            .insert([{ title, location, items }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update menu items
// @route   PUT /api/menus/:id
// @access  Private/Admin
exports.updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { items, title } = req.body;

        const updates = { items, updated_at: new Date() };
        if (title) updates.title = title;

        const { data, error } = await supabase
            .from('menus')
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

// @desc    Initialize default menus if empty
// @route   POST /api/menus/init
// @access  Private/Admin
exports.initMenus = async (req, res) => {
    try {
        // Check if menus exist
        const { count, error: countError } = await supabase
            .from('menus')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        if (count > 0) {
            return res.status(200).json({ message: 'Menus already initialized' });
        }

        const defaultMenus = [
            {
                title: 'Main Header',
                location: 'header',
                items: [
                    { label: 'Home', link: '/' },
                    { label: 'Hotels', link: '/hotels' },
                    { label: 'Flights', link: '/flights' },
                    { label: 'Packages', link: '/packages' },
                    { label: 'Contact', link: '/contact' }
                ]
            },
            {
                title: 'Footer Company',
                location: 'footer_company',
                items: [
                    { label: 'About Us', link: '/about' },
                    { label: 'Careers', link: '/careers' },
                    { label: 'Blog', link: '/blog' }
                ]
            }
        ];

        const { data, error } = await supabase
            .from('menus')
            .insert(defaultMenus)
            .select();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
