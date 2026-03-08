const supabase = require('../config/supabase');

// @desc    Get Sales Report (CSV format)
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
exports.getSalesReport = async (req, res) => {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*, services(name)')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Convert to CSV
        const header = "Date,Customer,Service,Status,Total Price\n";
        const rows = bookings.map(b =>
            `${new Date(b.created_at).toLocaleDateString()},${b.customer.name},${b.services?.name},${b.status},${b.total_price}`
        ).join("\n");

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=sales_report.csv');
        res.send(header + rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Occupancy Stats
// @route   GET /api/admin/reports/occupancy
// @access  Private/Admin
exports.getOccupancyStats = async (req, res) => {
    try {
        const { data: inventory, error } = await supabase
            .from('room_daily_prices')
            .select('*, hotel_rooms(room_type, total_units)')
            .order('date', { ascending: true });

        if (error) throw error;

        // Aggregate stats
        const stats = inventory.reduce((acc, curr) => {
            const date = curr.date;
            if (!acc[date]) acc[date] = { date, booked: 0, total: 0 };
            const total = curr.hotel_rooms?.total_units || 1;
            const available = curr.available_units ?? (curr.is_blocked ? 0 : total);
            acc[date].booked += (total - available);
            acc[date].total += total;
            return acc;
        }, {});

        res.json(Object.values(stats));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
