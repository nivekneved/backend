const express = require('express');
const router = express.Router();
const { newsletterSignup, submitFeedback, submitContactForm } = require('../controllers/miscController');

router.post('/newsletter', newsletterSignup);
router.post('/feedback', submitFeedback);
router.post('/contact', submitContactForm);
router.post('/logs', require('../controllers/miscController').logFrontendError);

module.exports = router;
