const express = require("express");
const { createRoomReport } = require("../controllers/roomReportsController");
const upload = require("../middleware/upload");
const { getAllReports } = require('../controllers/roomReportsController');
const { deleteOneReport, deleteAllReports } = require("../controllers/roomReportsController");
const router = express.Router();

// POST: Submit Room Report
router.post("/submit", upload.single("image"), createRoomReport);
// Route to get all room reports
router.get('/', getAllReports);

// Delete a specific room report by room_report_id
router.delete("/delete/:id", deleteOneReport);

// Delete all reports
router.delete("/delete-all", deleteAllReports);

module.exports = router;
