const express = require('express');
const router = express.Router();
const path = require('path');

/* GET home page - serve login form */
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

module.exports = router;
