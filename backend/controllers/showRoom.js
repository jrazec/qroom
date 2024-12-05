const scheduleTable = require('./../models/Schedule');
const roomTable = require("./../models/Room")

exports.single = async (req,res) =>{
    try {
        const rId = req.query.roomid;
        console.log(rId+"ss")
        const result = await scheduleTable.getRoom(rId);
        res.status(201).json(result);     
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }
}

exports.labAndClass = async (req,res) =>{
    try {
        const results = await roomTable.getLabAndRoom()
        console.log(results.results[0].room_name,"sss")
        const rooms = results.results.map(room => ({
        code: `https://shnc77kq-3000.asse.devtunnels.ms/user/room/${room.room_id}`,
        name: room.room_name,
        room_id : room.room_id,
        room_purpose: room.room_purpose,
        bldg_name: room.bldg_name,
        floor_number: room.floor_number
        }));
        res.status(200).json(rooms);  
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }

  }

  exports.rooms = async (req,res) =>{
    try {
        const room = await roomTable.getRoom()
        const sched = await roomTable.getRoomSched()
        res.status(200).json({room,sched});  
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }
  }