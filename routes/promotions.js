const express = require('express');
const router = express.Router();
const { getPromotions, getActivePromotions, createPromotion, updatePromotion, deletePromotion } = require('../controllers/promotionController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getPromotions); // List all (filter in frontend if needed, or use active endpoint)
router.get('/public/active', getActivePromotions); // Specific endpoint for consumers

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), createPromotion);
router.put('/:id', protect, authorize('admin'), updatePromotion);
router.delete('/:id', protect, authorize('admin'), deletePromotion);

module.exports = router;
