const express = require('express');
const router = express.Router();
const { getMenus, getMenuByLocation, createMenu, updateMenu, initMenus } = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getMenus);
router.get('/:location', getMenuByLocation);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createMenu);
router.post('/init', protect, authorize('admin'), initMenus);
router.put('/:id', protect, authorize('admin'), updateMenu);

module.exports = router;
