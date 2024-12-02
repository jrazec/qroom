const ReserveNotif = require('../models/ReserveNotif');


const sendRoomRequest = async (req, res) => {
    const { user_name,room_id } = req.body;
    const status = 'pending';


    try {
        const newRequest = new ReserveNotif({
            user_name,
            status,
            room_id
        });

        await newRequest.save();
        res.status(201).json({ message: 'Room request created successfully', id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = sendRoomRequest;