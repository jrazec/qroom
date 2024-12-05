const occupationTable = require('../models/Occupation');

exports.getDonutChartValues = async (req, res) => {
    try {
        const result = await occupationTable.getDonut();
      if (!result.status) {
        return res.status(404).json({ status: false, message: 'No data found' });
      }
      return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching donut chart values:', error);
        res.status(500).json({ error: 'An error occurred while fetching donut chart values' });
    }
};

exports.getDonutMonthly = async (req, res) => {
    try {
        const month = req.body.month
        const result = await occupationTable.getDonut(month);
      if (!result.status) {
        return res.status(404).json({ status: false, message: 'No data found' });
      }
      return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching donut chart values:', error);
        res.status(500).json({ error: 'An error occurred while fetching donut chart values' });
    }
};

