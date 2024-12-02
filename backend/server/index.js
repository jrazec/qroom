const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("../routes/users");
const adminRoute = require("../routes/admin");  // Import admin route
const path = require("path");
const connectDB = require("../config/mongodb");
const roomReportRoute = require("../routes/roomReports");
const reportsRoute = require("../routes/reports");
const roomRoutes = require("../routes/rooms"); // Room-related routes
const adminRoutes = require('../routes/adminRoutes');  // Admin route for authentication and other admin functionalities
const userRouteForgot = require('../routes/userRoutes');  // Import the user routes
const con = require('../config/db');  // MySQL or other DB connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files (if any)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log("Serving static files from:", path.join(__dirname, "../uploads"));

// Use room-related routes
app.use("/api/rooms", roomRoutes);

// Use user and admin routes
app.use("/user", userRoute);
app.use("/admin", adminRoute);  // Ensure you're using the admin route

// Use room reports and general reports
app.use("/room-reports", roomReportRoute);
app.use("/reports", reportsRoute);

// Admin routes, including protected ones
app.use('/api/admin', adminRoutes);  // This should now be properly routed

// Use the user routes
app.use('/api/user', userRouteForgot);

// Use section-related routes
app.use("/api", adminRoute);  // Use the updated section routes here
app.use(adminRoute);

// MySQL or other DB connection (ensure it's used in routes for section schedules)
con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);  // Exit the process if there's an error with the DB connection
  } else {
    console.log("Connected to the database!");
  }
});

// Your specific route to fetch section schedules (to simulate brute-force approach)
app.get("/api/get-section-schedules/:sectionName", (req, res) => {
  const sectionName = req.params.sectionName;

  // Simulate fetching section schedules from database
  const query = "SELECT * FROM schedules WHERE section_name = ?"; // Adjust based on your actual DB structure

  con.query(query, [sectionName], (err, result) => {
    if (err) {
      console.error("Error fetching section schedules:", err);
      return res.status(500).json({ status: false, message: "Error fetching schedules" });
    }

    if (result.length === 0) {
      console.warn(`No schedules found for section: ${sectionName}`);
      return res.status(404).json({ status: false, message: "No schedules found" });
    }

    // If schedules exist, send them back
    res.status(200).json({ status: true, sectionSchedules: result });
  });
});
app.post("/api/delete-schedules", (req, res) => {
  const { userName } = req.body;

  // Attempt to delete the schedules
  const query = "DELETE FROM user_section_schedules WHERE user_name = ?";

  con.query(query, [userName], (err, result) => {
    if (err) {
      console.error("Error removing schedules:", err);
      return res.status(500).json({ status: false, message: "Error removing schedules" });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ status: true, message: "Schedules removed successfully!" });
    } else {
      return res.status(404).json({ status: false, message: "No schedules found for this user" });
    }
  });
});

app.post("/api/add-section-to-student", (req, res) => {
  const { userName, sectionSchedId } = req.body;

  // Insert the new section into the user_section_schedules table
  const query = "INSERT INTO user_section_schedules (user_name, section_sched_id) VALUES (?, ?)";

  con.query(query, [userName, sectionSchedId], (err, result) => {
    if (err) {
      console.error("Error adding section:", err);
      return res.status(500).json({ status: false, message: "Error adding section" });
    }

    return res.status(200).json({ status: true, message: "Section added successfully!" });
  });
});


// Connect to MongoDB if you are using it (this is separate if you're using MongoDB)
connectDB();

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
