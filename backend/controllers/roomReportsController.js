const RoomReport = require("../models/RoomReport");

// Handle room report submission
const createRoomReport = async (req, res) => {
    try {
      const { room_report_id, room_id, room_name, room_purpose, status, approval } = req.body;
  
      // Debugging: Check if the file exists
      console.log("File received:", req.file);
  
      const image = req.file ? `/uploads/${req.file.filename}` : "No image uploaded";
  
      const newReport = new RoomReport({
        room_report_id,
        room_id,
        room_name,
        room_purpose,
        status,
        image,
        approval,
      });
  
      await newReport.save();
      res.status(201).json({ message: "Room report created successfully.", report: newReport });
    } catch (error) {
      console.error("Error in createRoomReport:", error);
      res.status(500).json({ message: "Failed to create room report.", error: error.message });
    }
  };

  // Controller to get all room reports
const getAllReports = async (req, res) => {
    try {
      const reports = await RoomReport.find();
      res.status(200).json(reports);
    } catch (err) {
      console.error("Error fetching room reports:", err);
      res.status(500).json({ message: "Error fetching reports" });
    }
  };

  // Delete a specific room report by room_report_id
const deleteOneReport = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedReport = await RoomReport.findOneAndDelete({ room_report_id: id });
  
      if (!deletedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
  
      res.status(200).json({ message: "Report deleted successfully", report: deletedReport });
    } catch (err) {
      console.error("Error deleting report:", err);
      res.status(500).json({ message: "Error deleting report" });
    }
  };
  
  // Delete all reports
  const deleteAllReports = async (req, res) => {
    try {
      const deletedReports = await RoomReport.deleteMany({});
      res.status(200).json({ message: "All reports deleted successfully", deletedCount: deletedReports.deletedCount });
    } catch (err) {
      console.error("Error deleting all reports:", err);
      res.status(500).json({ message: "Error deleting all reports" });
    }
  };
  

module.exports = { createRoomReport,  getAllReports,  deleteOneReport,
    deleteAllReports };
