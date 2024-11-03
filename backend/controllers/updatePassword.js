const bcrypt = require("bcrypt");
const con = require("../config/db");

exports.updatePassword = async (req, res) => {
  const { userid, oldpass, newpass } = req.body;

  try {
    // Fetch user
    const [user] = await con.query("SELECT password FROM users WHERE user_name = ?", [userid]);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check old password
    const match = await bcrypt.compare(oldpass, user.password);
    if (!match) return res.status(400).json({ message: "Incorrect old password" });

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newpass, 10);
    await con.query("UPDATE users SET password = ? WHERE user_name = ?", [hashedPassword, userid]);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
