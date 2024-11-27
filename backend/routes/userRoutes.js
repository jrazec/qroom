const express = require('express');
const router = express.Router();
const { forgotPassword } = require('../controllers/userController');
const { resetPassword } = require('../controllers/userController');

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Password reset route
router.post('/reset-password', resetPassword);

module.exports = router;
