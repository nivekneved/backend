const express = require('express');
const router = express.Router();
const {
    createBooking,
    getBookings,
    updateBookingStatus,
    createPackageRequest,
    notifyBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Public/Authenticated: Create bookings & requests
router.post('/', protect, createBooking);
router.post('/package-request', protect, createPackageRequest);

// Staff/Admin: Manage bookings
router.get('/', protect, authorize('admin', 'staff'), getBookings);
router.put('/:id', protect, authorize('admin', 'staff'), updateBookingStatus);
router.post('/notify', protect, authorize('admin', 'staff'), notifyBooking);

module.exports = router;
