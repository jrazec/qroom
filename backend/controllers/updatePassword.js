const con = require("../config/db");
const bcrypt = require("bcrypt");

exports.updatePassword = async (req, res) => {
  const { user_name, oldpass, newpass } = req.body;

  // Basic validation to ensure all fields are provided
  if (!user_name || !oldpass || !newpass) {
    console.error('Validation failed: missing required fields');
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Retrieve the user's current hashed password from the database
    const [rows] = await con.promise().query("SELECT password FROM users WHERE user_name = ?", [user_name]);

    // Check if the user exists
    if (rows.length === 0) {
      console.error(`User not found: ${user_name}`);
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentHashedPassword = rows[0].password;

    // Compare the old password with the stored hashed password
    const isMatch = await bcrypt.compare(oldpass, currentHashedPassword);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      console.error(`Incorrect old password for user: ${user_name}`);
      return res.status(400).json({ success: false, message: "Incorrect old password" });
    }

    // Hash the new password before saving it
    const newHashedPassword = await bcrypt.hash(newpass, 10);
    console.log("New hashed password generated for user:", user_name);

    // Update the password in the database
    await con.promise().query("UPDATE users SET password = ? WHERE user_name = ?", [newHashedPassword, user_name]);

    // Send success response
    console.log(`Password updated successfully for user: ${user_name}`);
    res.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    // Detailed error logging for debugging
    console.error("Error changing password:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
