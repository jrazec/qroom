const express = require("express");
const bodyParser = require('body-parser');
const multer = require("multer");

const showAccount = require('./../controllers/showAccount');
const createAccount = require('./../controllers/createAccount');
const updateAccount = require('./../controllers/updateAccount');
const deleteAccount = require('./../controllers/deleteAccount');
const showUserSchedule = require('./../controllers/showUserSchedule');
const showRoom = require('./../controllers/showRoom');
const occupationController = require('../controllers/occupationController');
const getRoomSpecificSchedule = require('../controllers/getRoomSpecificSchedule');

const updatePassword = require("../controllers/updatePassword").updatePassword;
const { uploadPicture, deleteProfilePicture, getProfilePicture } = require("../controllers/uploadPicture");
const { getRoomsByBuilding } = require("../controllers/roomList");
const { getRoomsByFloor } = require("../controllers/roomsByFloor");
const { getBuildings } = require("../controllers/roomList");
const { getRoom } = require("../models/Schedule");
const showRoomStatus = require('../controllers/showRoomStatus');
const {getRoomOccup} = require('../controllers/occupationController')
const { getUserOccupied } = require('../controllers/occupationController');
const router = express.Router();

// Middleware configurations
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Existing routes
router.route("/login").post(showAccount.single);
router.route("/schedule").post(showUserSchedule.single);
router.route("/rooms").get(showRoom.single);

// New route for changing password
router.post("/change-password", updatePassword);

// Profile Picture Routes
router.post("/picture/upload", multer({ storage: require('../config/multerConfig') }).single("picture"), uploadPicture); // Separate multer config file
router.delete("/picture/delete", deleteProfilePicture);
router.get("/:user_name/profile-picture", getProfilePicture);

router.get("/rooms/building", getRoomsByBuilding);
router.get("/rooms/floor", getRoomsByFloor);
router.get("/buildings", getBuildings); // Route to get all distinct buildings

router.post('/occupation', occupationController.createOccupation);
router.put('/occupation', occupationController.updateOccupationStatus);
router.get('/occupations', occupationController.getOccupations);

router.get('/check-room', getRoomOccup)
router.get('/room-status/:id/:roomid', showRoomStatus);
router.get('/validate-schedule/:roomId', getRoomSpecificSchedule.single);
router.post('/get-user-occupied', getUserOccupied);

router.post('/occupy-room', occupationController.toggleOccupyRoom);


module.exports = router;
