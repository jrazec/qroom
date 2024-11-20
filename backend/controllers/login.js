const { generateToken } = require('../utils/jwt');
const userTable = require('../models/Account'); // Example user model

exports.login = async (req, res) => {
    const { user_name, password } = req.body;
    try {
      const user = await userTable.getSingleAccount({ user_name, password });
      if (user.status) {
        const token = generateToken(user.user); // Ensure this line is correct
        res.json({ status: true, token }); // Ensure the token is being sent
      } else {
        res.status(401).json({ status: false, message: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
