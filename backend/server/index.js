const express = require("express");
const dotenv = require("dotenv");
const con = require("../config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoute = require("../routes/users");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "../../uploads"))); // Serve uploads folder
app.use("/user", userRoute);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
