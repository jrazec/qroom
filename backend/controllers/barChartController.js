const occupationTable = require('../models/Occupation');

exports.getBarChartValuesMonthly = async (req, res) => {
    try {
        const month = req.body.month
        const result = await occupationTable.getBarChart(month);
      if (!result.status) {
        return res.status(404).json({ status: false, message: 'No data found' });
      }
      return res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching bar chart values:', error);
        res.status(500).json({ error: 'An error occurred while fetching donut chart values' });
    }
};