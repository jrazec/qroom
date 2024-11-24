const Report = require('../models/Report');

// Add a new report
exports.addReport = async (req, res) => {
  try {
    const { room_name, room_id, report, resolved } = req.body;

    if (!room_name || !room_id || !report) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newReport = new Report({
      room_name,
      room_id,
      report,
      resolved,
    });

    await newReport.save();
    res.status(201).json({ message: 'Report submitted successfully!', report: newReport });
  } catch (error) {
    console.error('Error adding report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find();
    res.status(200).json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete all reports
exports.deleteAllReports = async (req, res) => {
  try {
    await Report.deleteMany();
    res.status(200).json({ message: 'All reports deleted successfully.' });
  } catch (error) {
    console.error('Error deleting reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a specific report
exports.deleteReport = async (req, res) => {
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
};
