const express = require("express");
const router = express.Router();
const bodyParser = require('body-parser');
const showAccount = require('./../controllers/showAccount');
const createAccount = require('./../controllers/createAccount');
const updateAccount = require('./../controllers/updateAccount');
const deleteAccount = require('./../controllers/deleteAccount');
const showRoom = require("./../controllers/showRoom");
const showIntructors = require('./../controllers/showInstructors');
const showUserSchedule = require('./../controllers/showUserSchedule');
const updateDocument = require("./../controllers/updateDocument");
const createSchedule = require("./../controllers/createSchedule");
const { deleteSchedule } = require("./../controllers/deleteSchedule");
const createSection = require('./../controllers/createSection');
const { showSectionSchedules } = require("./../controllers/showSectionSchedule");
const sectionController = require('../controllers/sectionController'); 
const { getSectionSchedules, addSchedulesForIrregular, addSchedulesForRegular } = require('../controllers/sectionController'); 

// -> Middlewares
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.use(express.static("frontend"));

// Admin Login Page
router
    .route("/accounts")
    .get(showAccount.all)
    .post(createAccount.single)
    .put(updateAccount.single)
    .delete(deleteAccount.single);

router.get('/instructors-subjects', showIntructors.all);

router.route("/rooms").get(showRoom.labAndClass);
router.route("/room-sched").get(showRoom.rooms);
router.route("/update-document").post(updateDocument.single);

router.post("/save-schedule", createSchedule.single);
router.delete("/delete-schedule", deleteSchedule);

router.get('/user-withWithoutSched', showAccount.with_withoutSchedule);
router.post('/add-user-to-section', createSchedule.section);
router.delete('/user-removeSection', deleteAccount.removeSection);
router.post('/sections', createSection.single);

router.post('/section-schedule', showSectionSchedules);

// Route to fetch all sections
router.get('/sections', sectionController.getSections);

// Route to fetch sections by department
router.get('/sections/department/:department', sectionController.getSectionsByDepartment);

// Route to add sections to a user
router.post('/add-sections-to-user', sectionController.addSectionsToUser);

// Route to fetch departments
router.get('/departments', sectionController.getDepartments);

router.get('/api/get-section-schedules/:section_name', getSectionSchedules);

router.post('/api/add-schedules-for-regular', addSchedulesForIrregular);
router.post('/api/add-schedules-for-irregular', addSchedulesForRegular);

module.exports = router;
