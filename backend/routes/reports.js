const express = require("express");
const router = express.Router();
const Report = require("../models/Report"); // Import your Report model
const {
  addReport,
  getReports,
  deleteAllReports,
  deleteReport,
} = require("../controllers/reportsController");


// Add a new report
router.post('/submit', addReport);

// Get all reports
router.get('/', getReports);

// Delete all reports
router.delete('/delete-all', deleteAllReports);

// Delete a specific report
router.delete('/:id', deleteReport);

router.delete('/delete/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get the report ID from the request params
      const deletedReport = await Report.findByIdAndDelete(id); // Delete the report by ID
  
      if (!deletedReport) {
        return res.status(404).json({ message: "Report not found" }); // If no report was found, return 404
      }
  
      res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
      console.error("Error deleting report:", error);
      res.status(500).json({ error: "Failed to delete report" });
    }
  });

  router.patch('/update/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { resolved } = req.body; // Get the updated resolved status from the request body
  
      const updatedReport = await Report.findByIdAndUpdate(
        id,
        { resolved },
        { new: true } // Return the updated document
      );
  
      if (!updatedReport) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      res.status(200).json({ message: 'Report updated successfully', updatedReport });
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({ error: 'Failed to update report' });
    }
  });
  
  

module.exports = router;
