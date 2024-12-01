const sectionTable = require('./../models/Section');

exports.single = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { sectionName, programName, startMonth, endMonth } = req.body;
        console.log('Section name:', sectionName, programName, startMonth, endMonth);
        
        const newSection = await sectionTable.createSection(sectionName, programName, startMonth, endMonth);
        console.log('New section created:', newSection);
        
        res.status(201).json({ message: "Section created successfully", data: newSection });
    } catch (error) {
        console.error('Error in createSection:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};