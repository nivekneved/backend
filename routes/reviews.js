const express = require('express');
const router = express.Router();
const {
    getServiceReviews,
    createReview,
    moderateReview,
    getAllReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Public: View reviews
router.get('/services/:serviceId', getServiceReviews);

// Protected: Create review (User must be logged in)
router.post('/', protect, createReview);

// Admin: Manage reviews
router.get('/', protect, authorize('admin', 'staff'), getAllReviews);
router.put('/:id', protect, authorize('admin'), moderateReview);

module.exports = router;
