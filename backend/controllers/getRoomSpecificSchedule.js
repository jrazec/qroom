const occupationTable = require('../models/Occupation'); // Example user model

exports.single = async (req, res) => {
    const { roomId } = req.params;
    try {
      const schedule = await occupationTable.getOccupationsByRoom(roomId);
      if (!schedule.status) {
        return res.status(404).json({ status: false, message: 'No schedule found' });
      }
      return res.status(200).json({ status: true, message: 'Valid schedule', schedule: schedule.results });

    } catch (error) {
      console.error('Error validating schedule:', error);
      res.status(500).json({ status: false, message: 'Internal server error' });
    }
  }

