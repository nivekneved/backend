const express = require('express');
const router = express.Router();
const path = require('path');
const dashboardController = require('../controllers/dashboardController');

const { protect } = require('../middleware/auth');

// API Endpoint for stats
router.get('/stats', protect, dashboardController.getTableStats);

// API Endpoint for specific table data
router.get('/data/:table', protect, dashboardController.getTableData);

// Serve the dashboard UI
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Handle specific table management routes (prevent 404)
router.get('/:table', (req, res, next) => {
    // If the "table" looks like a file (has an extension), ignore it here
    if (req.params.table.includes('.')) {
        return next();
    }
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

module.exports = router;
