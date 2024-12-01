const scheduleTable = require('../models/Schedule');

exports.showSectionSchedules = async (req, res) => {
    try {
        const section_name = req.body.section_name;
        const schedule = await scheduleTable.getSectionSchedules(section_name);
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve sections schedule' });
    }
};
