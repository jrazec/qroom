const mongoose = require("mongoose");

const RoomReportSchema = new mongoose.Schema({
  room_report_id: { type: String, unique: true, required: true },
  room_id: { type: String, required: true },
  room_name: { type: String, required: true },
  room_purpose: { type: String, required: true },
  status: { type: String, enum: ["clean", "dirty", "unsure"], required: true },
  image: { type: String, default: "No image uploaded" },
  approval: { type: String, enum: ["approved", "not yet"], default: "not yet" },
});

module.exports = mongoose.model("RoomReport", RoomReportSchema);
