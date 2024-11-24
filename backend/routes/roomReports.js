const express = require("express");
const { createRoomReport } = require("../controllers/roomReportsController");
const upload = require("../middleware/upload");
const { getAllReports } = require('../controllers/roomReportsController');
const { deleteOneReport, deleteAllReports } = require("../controllers/roomReportsController");
const router = express.Router();
const roomReportsController = require("../controllers/roomReportsController");
const RoomReport = require("../models/RoomReport");

// POST: Submit Room Report
router.post("/submit", upload.single("image"), createRoomReport);
// Route to get all room reports
router.get('/', getAllReports);

// Delete a specific room report by room_report_id
router.delete("/delete/:id", deleteOneReport);

// Delete all reports
router.delete("/delete-all", deleteAllReports);

// Update approval for a specific room report
router.patch("/update/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { approval } = req.body;
  
      if (!approval) {
        return res.status(400).json({ message: "Approval field is required" });
      }
  
      const updatedReport = await RoomReport.findOneAndUpdate(
        { room_report_id: id },
        { approval },
        { new: true }
      );
  
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
  
      res.status(200).json({ message: "Approval updated successfully", updatedReport });
    } catch (error) {
      console.error("Error updating approval:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // routes/roomReports.js
router.get("/", async (req, res) => {
    try {
      const roomReports = await RoomReport.find(); // Fetch all room reports
      res.status(200).json(roomReports);
    } catch (error) {
      console.error("Error fetching room reports:", error);
      res.status(500).json({ error: "Failed to fetch room reports" });
    }
  });
  

module.exports = router;
