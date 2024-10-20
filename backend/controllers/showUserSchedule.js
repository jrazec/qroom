const scheduleTable = require('./../models/Schedule');

exports.single = async (req, res) => {
    try {
        const result = await scheduleTable.getSingleSchedule(req.body.uName);
        res.status(200).json(result);
        console.log(result)
    } catch (error) {
        console.error('Error in single:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};