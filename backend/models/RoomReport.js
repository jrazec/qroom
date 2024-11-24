const mongoose = require("mongoose");

const roomReportSchema = new mongoose.Schema({
  room_report_id: { type: String, required: true, unique: true },
  room_id: { type: String, required: true },
  room_name: { type: String, required: true },
  room_purpose: { type: String },
  status: { type: String, required: true },
  image: { type: String, default: "No image uploaded" },
  approval: { type: String, default: "not yet" },
});

module.exports = mongoose.model("RoomReport", roomReportSchema);
