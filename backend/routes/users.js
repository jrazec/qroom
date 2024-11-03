// backend/routes/users.js
const express = require("express");
const bodyParser = require('body-parser');
const multer = require("multer");
const showAccount = require('./../controllers/showAccount');
const createAccount = require('./../controllers/createAccount');
const updateAccount = require('./../controllers/updateAccount');
const deleteAccount = require('./../controllers/deleteAccount');
const showUserSchedule = require('./../controllers/showUserSchedule');
const showRoom = require('./../controllers/showRoom');
const updatePassword = require("../controllers/updatePassword").updatePassword;
const uploadPicture = require("../controllers/uploadPicture").uploadPicture;
const con = require("../config/db"); // Ensure db connection is included if not already

const router = express.Router();

// Middleware configurations
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Existing routes
router.route("/login").post(showAccount.single);
router.route("/schedule/").post(showUserSchedule.single);
router.route("/rooms").get(showRoom.single);

// Configure multer for picture uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// New route for changing password
router.post("/change-password", updatePassword);

// New route for uploading profile picture
router.post("/picture/upload", upload.single("picture"), uploadPicture);

// backend/routes/users.js
router.get("/:user_name/profile-picture", (req, res) => {
    const { user_name } = req.params;
    con.query("SELECT image FROM users WHERE user_name = ?", [user_name], (error, results) => {
      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({ message: "Database error", error });
      }
      if (!results.length || !results[0].image) {
        return res.status(404).json({ message: "No picture found" });
      }
      res.json({ imageUrl: results[0].image });
    });
  });
  


module.exports = router;
