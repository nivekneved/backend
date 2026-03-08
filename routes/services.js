const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createService,
    updateService,
    deleteService,
    getInventory,
    updateInventoryBlock,
    bulkUpdateInventory,
    batchUpdatePrices,
    getRooms
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getProducts)
    .post(protect, authorize('admin'), createService);

router.route('/:id/rooms')
    .get(protect, authorize('admin'), getRooms);

router.route('/:id/inventory')
    .get(protect, authorize('admin'), getInventory);

router.route('/:id/inventory/bulk')
    .post(protect, authorize('admin'), bulkUpdateInventory);

router.route('/:id/inventory/batch')
    .post(protect, authorize('admin'), batchUpdatePrices);

router.route('/:id/inventory/block')
    .post(protect, authorize('admin'), updateInventoryBlock);

router.route('/:id')
    .get(getProductById)
    .put(protect, authorize('admin'), updateService)
    .delete(protect, authorize('admin'), deleteService);

module.exports = router;
