// backend/controllers/updatePassword.js
const con = require("../config/db");

exports.updatePassword = async (req, res) => {
  const { user_name, oldpass, newpass } = req.body;

  try {
    // Add .promise() here to enable async/await
    const [rows] = await con.promise().query("SELECT password FROM users WHERE user_name = ?", [user_name]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the old password matches
    if (oldpass !== rows[0].password) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Update the password
    await con.promise().query("UPDATE users SET password = ? WHERE user_name = ?", [newpass, user_name]);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
