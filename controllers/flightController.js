// @desc    Get Flight Engine URL (Golibe)
// @route   GET /api/flights/search
// @access  Public
exports.searchFlights = async (req, res) => {
    try {
        const engineUrl = 'https://travellounge.golibe.com';

        // Return the engine URL and any parameters needed for the UI to link/iframe
        res.json({
            engineUrl,
            message: 'Redirect to Travel Lounge Flight Engine (Golibe)',
            instructions: 'Use this URL to open the flight search interface'
        });
    } catch (error) {
        res.status(500).json({ message: 'Flight engine configuration failed' });
    }
};
