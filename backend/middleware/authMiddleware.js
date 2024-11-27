const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.id; // Store the decoded admin ID in request for later use
    next();  // Pass control to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });  // Invalid token error
  }
};

module.exports = authMiddleware;
