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
const { uploadPicture, deleteProfilePicture, getProfilePicture } = require("../controllers/uploadPicture");

const router = express.Router();

// Middleware configurations
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Existing routes
router.route("/login").post(showAccount.single);
router.route("/schedule/").post(showUserSchedule.single);
router.route("/rooms").get(showRoom.single);

// New route for changing password
router.post("/change-password", updatePassword);

// Profile Picture Routes
router.post("/picture/upload", multer({ storage: require('../config/multerConfig') }).single("picture"), uploadPicture); // Separate multer config file
router.delete("/picture/delete", deleteProfilePicture);
router.get("/:user_name/profile-picture", getProfilePicture);

module.exports = router;
