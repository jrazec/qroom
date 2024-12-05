// backend/controllers/uploadPicture.js
const fs = require('fs');
const path = require('path');
const con = require('../config/db');

// Upload Profile Picture
exports.uploadPicture = (req, res) => {
  const { user_name } = req.body;
  const picture = req.file ? req.file.filename : null;
  let oldPic = {};

  if (!picture) return res.status(400).json({ message: "No picture uploaded" });

  const imageUrl = `/uploads/${picture}`;

  // Fetch the current image from the database
  con.query("SELECT image FROM users WHERE user_name = ?", [user_name], (error, result) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Database error", error });
    }
    oldPic = result[0];

    // If there's an old image, attempt to delete it
    if (oldPic && oldPic.image) {
      const oldImagePath = path.join(__dirname, '..', oldPic.image);

      // Check if the file exists before deleting
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Error deleting old image:", err);
            return res.status(500).json({ message: "Error deleting old image", error: err });
          }
          console.log("Old image deleted successfully");
        });
      } else {
        console.log("Old image not found, skipping deletion.");
      }
    }
  });

  // Update the user's profile picture in the database
  con.query("UPDATE users SET image = ? WHERE user_name = ?", [imageUrl, user_name], (error) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Database error", error });
    }
    res.json({ message: "Picture uploaded successfully", imageUrl, oldPic });
  });
};

// Delete Profile Picture
exports.deleteProfilePicture = (req, res) => {
  const { filePath } = req.body;

  if (!filePath || !filePath.startsWith("/uploads/")) {
    return res.status(400).json({ message: "Invalid file path." });
  }

  const absolutePath = path.join(__dirname, "../..", filePath);

  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).json({ message: "Error deleting file." });
    }
    res.json({ message: "File deleted successfully!" });
  });
};

// Get Profile Picture
exports.getProfilePicture = (req, res) => {
  const { user_name } = req.params;

  con.query("SELECT image,user_name,CONCAT(first_name,' ',middle_name,' ',last_name) as full_name FROM users WHERE user_name = ?", [user_name], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Database error", error });
    }
    if (!results.length || !results[0].image) {
      return res.status(404).json({ message: "No picture found" });
    }
    res.json({ imageUrl: results[0].image,results });
  });
};
