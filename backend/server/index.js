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

// Connect to DB
connectDB();

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
