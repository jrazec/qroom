const express = require("express");

const PORT = process.env.PORT || 3001;
const hostname = "0.0.0.0";
const app = express();

app.get("/api", (req, res) => {
    res.json({ message: "asd" });
});

app.listen(PORT,hostname, () => {
  console.log(`Server listening on ${hostname+PORT}`);
});