// const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Google reCAPTCHA Secret Key
// const RECAPTCHA_SECRET_KEY = '6LfT84cqAAAAAL8yzip2W08lSkixpwTpL2nytHny';

// backend/controllers/adminController.js
const loginAdmin = async (req, res) => {
    const { user_name, password, captcha } = req.body;  // Ensure you're expecting these fields
  
    console.log('Received login request:', req.body);  // Log incoming request
  
    try {
      // Check if the admin exists in the database
      const admin = await Admin.findOne({ username: user_name });  // Ensure you're looking for 'user_name' field
      if (!admin) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Send response with token and user data
      res.json({
        message: 'Login successful',
        token,
        user: {
          user_name: admin.username,  // Correct field for username
          role: admin.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
// Register Admin (already implemented)
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
    });

    // Save the new admin to the database
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginAdmin, registerAdmin };
