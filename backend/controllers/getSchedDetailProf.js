const scheduleTable = require('../models/Schedule'); // Example user model

exports.profDetail = async (req, res) => {
    const { uName } = req.body;
    console.log('Received uName in backend:', uName);
    try {
      const schedule = await scheduleTable.getScheduleDetailProf(uName);
      if (!schedule.status) {
        return res.status(404).json({ status: false, message: 'No professors found' });
      }
      console.log("what we got here:", schedule);
      return res.status(200).json({ status: true, message: 'Valid schedule', professor: schedule.result });
      

    } catch (error) {
      console.error('Error validating schedule:', error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  }