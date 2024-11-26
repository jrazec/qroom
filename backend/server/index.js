// backend/server/index.js
const express = require("express");
const dotenv = require("dotenv");
const con = require("../config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("../routes/users");
const adminRoute = require("../routes/admin")
const path = require("path");
const connectDB = require("../config/mongodb");
const roomReportRoute = require("../routes/roomReports");
const reportsRoute = require('../routes/reports');
const roomRoutes = require('../routes/rooms'); // Adjust the path if needed
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log("Serving static files from:", path.join(__dirname, "../uploads")); // Debugging line

app.use('/api/rooms', roomRoutes);

// User routes
app.use("/user", userRoute);
app.use("/admin", adminRoute);

app.use("/room-reports", roomReportRoute);

app.use('/reports', reportsRoute);

connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
