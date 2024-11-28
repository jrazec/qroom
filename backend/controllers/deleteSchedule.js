const scheduleTable = require('./../models/Schedule');

exports.deleteSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.body;

        // Call the model to delete the schedule
        const result = await scheduleTable.deleteSchedule(scheduleId);
        
        if (result.status) {
            res.status(200).json({ message: 'Schedule deleted successfully', data: result });
        } else {
            res.status(400).json({ error: 'Failed to delete the schedule' });
        }
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ error: 'An error occurred while deleting the schedule' });
    }
};
