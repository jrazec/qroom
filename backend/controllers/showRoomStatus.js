const roomTable = require("./../models/Room")

const getRoomStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const roomid = req.params.roomid;
        console.log(id,roomid,"id,roomid)")
        const result = await roomTable.getStatus(id,roomid)
        res.status(201).json(result); 
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response 
    }
};


module.exports = getRoomStatus;

