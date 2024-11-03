// backend/controllers/uploadPicture.js
const con = require("../config/db");

exports.uploadPicture = (req, res) => {
  const { user_name } = req.body;
  const picture = req.file ? req.file.filename : null;

  if (!picture) return res.status(400).json({ message: "No picture uploaded" });

  const imageUrl = `/uploads/${picture}`; // Path to access the image
  con.query("UPDATE users SET image = ? WHERE user_name = ?", [imageUrl, user_name], (error) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Database error", error });
    }
    res.json({ message: "Picture uploaded successfully", imageUrl });
  });
};
