const express = require("express");
const dotenv = require('dotenv');

dotenv.config()

const PORT = process.env.PORT || process.env.PROXY || 3001;
const hostname = "0.0.0.0";
const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "asd" });
});

app.listen(PORT,hostname, () => {
  console.log(`Server listening on ${hostname+PORT}`);
  console.log(process.env.PORT)
});