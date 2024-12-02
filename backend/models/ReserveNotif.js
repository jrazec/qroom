const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ReserveNotifSchema = new Schema({
    user_name: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    room_id: {
        type: Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
});


module.exports = mongoose.model('ReserveNotif', ReserveNotifSchema);