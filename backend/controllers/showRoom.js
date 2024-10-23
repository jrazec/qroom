const scheduleTable = require('./../models/Schedule');


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