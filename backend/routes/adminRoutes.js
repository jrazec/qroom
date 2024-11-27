const express = require('express');
const router = express.Router();
const { loginAdmin, registerAdmin } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); // Import authMiddleware

// Login route (Public route, doesn't need token verification)
router.post('/login', loginAdmin);

// Register route (Public route)
router.post('/register', registerAdmin);

// Protected admin routes (these require a valid token)
router.use(authMiddleware); // Apply authMiddleware to all the routes below

router.get('/dashboard', (req, res) => {
  // Admin dashboard data
  res.json({ message: "Welcome to the Admin Dashboard" });
});

module.exports = router;
