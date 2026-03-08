const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const { protect, authorize } = require('../middleware/auth');

// Public Route
router.get('/', heroController.getHeroSlides);

// Admin Routes (Protected)
router.post('/', protect, authorize('admin', 'editor'), heroController.createSlide);
router.put('/:id', protect, authorize('admin', 'editor'), heroController.updateSlide);
router.delete('/:id', protect, authorize('admin', 'editor'), heroController.deleteSlide);

module.exports = router;
