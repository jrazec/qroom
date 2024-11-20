const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'yourSecretKey'; // Use a strong secret key from your .env file

// Function to generate a token
const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
};

// Function to verify a token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
};

module.exports = { generateToken, verifyToken };
