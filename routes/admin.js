const express = require('express');
const router = express.Router();
const { login, setup } = require('../controllers/adminController');
const { getSettings, updateSetting } = require('../controllers/settingController');
const { getSalesReport, getOccupancyStats } = require('../controllers/reportController');
const { getUserData, deleteUserData } = require('../controllers/gdprController');
const { getTableData } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', login);
router.post('/setup', setup);

// Protected routes
router.get('/settings', protect, authorize('admin', 'staff'), getSettings);
router.put('/settings/:key', protect, authorize('admin'), updateSetting);
router.get('/audit-logs', protect, authorize('admin'), (req, res) => {
    req.params.table = 'audit_logs';
    getTableData(req, res);
});
router.get('/reports/sales', protect, authorize('admin'), getSalesReport);
router.get('/reports/occupancy', protect, authorize('admin'), getOccupancyStats);
router.get('/gdpr/user-data', protect, authorize('admin'), getUserData);
router.delete('/gdpr/user-data', protect, authorize('admin'), deleteUserData);

module.exports = router;
