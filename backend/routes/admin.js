const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const showAccount = require('./../controllers/showAccount')
const createAccount = require('./../controllers/createAccount')
const updateAccount = require('./../controllers/updateAccount')
const deleteAccount = require('./../controllers/deleteAccount')
const showRoom = require("./../controllers/showRoom")
const showIntructors = require('./../controllers/showInstructors')
const showUserSchedule = require('./../controllers/showUserSchedule')
const updateDocument = require("./../controllers/updateDocument");
const createSchedule = require("./../controllers/createSchedule");
const {deleteSchedule} = require("./../controllers/deleteSchedule");

// -> Middlewares
router.use(bodyParser.json())
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Admin Login Page
router
    .route("/accounts")
    .get(showAccount.all)
    .post(createAccount.single)
    .put(updateAccount.single)
    .delete(deleteAccount.single);

router.get('/instructors-subjects', showIntructors.all)

router.route("/rooms").get(showRoom.labAndClass)
router.route("/room-sched").get(showRoom.rooms)
router.route("/update-document").post(updateDocument.single)

router.post("/save-schedule", createSchedule.single)
router.delete("/delete-schedule", deleteSchedule)

router.get('/user-withWithoutSched', showAccount.with_withoutSchedule)
router.post('/add-user-to-section', createSchedule.section)
router.delete('/user-removeSection', deleteAccount.removeSection)

module.exports = router;



