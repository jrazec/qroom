// @ts-nocheck
const express = require("express");
const dotenv = require('dotenv');
const con = require("../config/db");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser'); // Parsing the req 
const adminRoute = require('./../routes/admin')
const userRoute = require('./../routes/users')
dotenv.config()

const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(bodyParser.json())

app.use("/api",adminRoute);
app.use("/user",userRoute)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});

