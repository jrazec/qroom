const express = require("express");
const bodyParser = require('body-parser');
const router = require("./admin");
const showAccount = require('./../controllers/showAccount');
const createAccount = require('./../controllers/createAccount');
const updateAccount = require('./../controllers/updateAccount');
const deleteAccount = require('./../controllers/deleteAccount');
const showUserSchedule = require('./../controllers/showUserSchedule');
const showRoom = require('./../controllers/showRoom');

// -> Middlewares
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Existing routes
router.route("/login")
    .post(showAccount.single);

router.route("/schedule/")
    .post(showUserSchedule.single);

router.route("/rooms")
    .get(showRoom.single);

// Import necessary modules and controllers for new features
const multer = require("multer");
const updatePassword = require("../controllers/updatePassword").updatePassword;
const uploadPicture = require("../controllers/uploadPicture").uploadPicture;

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

// Additional routes for password change and picture upload
router.post("/change-password", updatePassword);
router.post("/picture/upload", upload.single("picture"), uploadPicture);

module.exports = router;
