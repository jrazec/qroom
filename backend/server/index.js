const express = require("express");
const dotenv = require('dotenv');

const app = express();

const PORT = process.env.PORT || process.env.PROXY || 3001;
dotenv.config()

app.get("/api", (req, res) => {
    res.json({ message: "asd" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log(process.env.PORT)
});