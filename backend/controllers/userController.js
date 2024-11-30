const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const con = require('../config/db');  // Import the MySQL connection
const dotenv = require('dotenv');
// For .env variable
dotenv.config()

// Forgot Password Controller
const forgotPassword = (req, res) => {
    const { user_name } = req.body;

    console.log("Received forgot password request for:", user_name); // Check if user_name is being passed correctly

    if (!user_name) {
      console.error("No user_name provided.");
      return res.status(400).json({ message: 'Please provide a valid SR Code (user name).' });
    }

    // Construct the full email address by appending '@g.batstate-u.edu.ph' to the user_name
    const fullEmail = `${user_name}@g.batstate-u.edu.ph`;
    console.log("Constructed email:", fullEmail);

    // Check if user exists in the database
    con.query('SELECT * FROM users WHERE user_name = ?', [user_name], (err, results) => {
        if (err) {
            console.error("Error querying the database:", err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            console.error("User not found in the database:", user_name);
            return res.status(404).json({ message: 'User not found.' });
        }

        // User exists, generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000;  // Token expires in 1 hour

        console.log("Generated reset token:", resetToken);

        // Update the user record with the reset token and expiration time
        con.query(
            'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE user_name = ?',
            [resetToken, resetTokenExpiration, user_name],
            (err) => {
                if (err) {
                    console.error("Error updating user record with reset token:", err);
                    return res.status(500).json({ message: 'Error saving reset token to database.' });
                }

                console.log("Database updated with reset token for:", user_name);

                // Set up Nodemailer transporter
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: '22-30660@g.batstate-u.edu.ph',
                        pass: 'oyrl qtfx eapm yemy',  // Your email password or OAuth2
                    },
                    debug: true, 
                    logger: true, 
                });

                const resetLink = `${process.env.LOCALHOST}/reset-password/${resetToken}`;
                console.log("Reset link generated:", resetLink);

                // Setup email options
                const mailOptions = {
                    from: '22-30660@g.batstate-u.edu.ph',
                    to: fullEmail,
                    subject: 'Password Reset Request',
                    text: `Click the following link to reset your password: ${resetLink}`,
                };

                // Send the reset link email
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.error("Error sending email:", err);
                        return res.status(500).json({ message: 'Error sending email.' });
                    }

                    console.log('Email sent: ' + info.response);
                    res.status(200).json({ message: 'Password reset link sent to your email.' });
                });
            }
        );
    });
};

// Reset Password Controller
const resetPassword = (req, res) => {
    const { token, password } = req.body;

    console.log('Received password reset request for token:', token);

    if (!token || !password) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    // Find the user with the given reset token
    con.query('SELECT * FROM users WHERE resetPasswordToken = ?', [token], (err, results) => {
        if (err) {
            console.error("Error querying the database:", err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            console.error("Invalid reset token.");
            return res.status(404).json({ message: 'Invalid or expired token.' });
        }

        const user = results[0];

        // Check if the token has expired
        const now = Date.now();
        if (now > user.resetPasswordExpires) {
            console.error("Reset token expired.");
            return res.status(400).json({ message: 'Reset token has expired.' });
        }

        // Hash the new password using bcrypt
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error hashing the password:", err);
                return res.status(500).json({ message: 'Error hashing password.' });
            }

            // Update the user's password and clear the reset token and expiration time
            con.query(
                'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE user_name = ?',
                [hashedPassword, user.user_name],
                (err, results) => {
                    if (err) {
                        console.error("Error updating password:", err);
                        return res.status(500).json({ message: 'Error updating password.' });
                    }

                    console.log("Password reset successful for user:", user.user_name);
                    res.status(200).json({ status: true, message: 'Password reset successful.' });
                }
            );
        });
    });
};

module.exports = { forgotPassword, resetPassword };
