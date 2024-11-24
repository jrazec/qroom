const express = require("express");
const { createRoomReport } = require("../controllers/roomReportsController");
const upload = require("../middleware/upload");

const router = express.Router();

// POST: Submit Room Report
router.post("/submit", upload.single("image"), createRoomReport);

module.exports = router;
