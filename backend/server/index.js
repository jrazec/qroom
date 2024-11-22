// backend/server/index.js
const express = require("express");
const dotenv = require("dotenv");
const con = require("../config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("../routes/users");
const adminRoute = require("../routes/admin");
const schedulingRoute = require("../routes/scheduling");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Serve static files from backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
console.log("Serving static files from:", path.join(__dirname, "../uploads")); // Debugging line

// User routes
app.use("/user", userRoute);
app.use("/admin", adminRoute);


app.use("/api/scheduling", schedulingRoute);

app.get("/api/buildings", async (req, res) => {
  try {
      const [rows] = await con.promise().query("SELECT DISTINCT bldg_name FROM rooms");
      res.json(rows);
  } catch (error) {
      console.error("Error fetching buildings:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
