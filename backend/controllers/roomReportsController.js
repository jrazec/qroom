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
  

module.exports = { createRoomReport };
