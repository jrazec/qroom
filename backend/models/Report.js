const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  room_name: { type: String, required: true },
  room_id: { type: String, required: true },
  report: { type: String, required: true },
  resolved: { type: String, enum: ['not yet', 'yes'], default: 'not yet' },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Report', reportSchema);
