const userTable = require('./../models/Account');
const courseTable = require('./../models/Course');
const sectionTable = require('./../models/Section');

exports.all = async (req,res) =>{
    try {
        const prof = await userTable.getInstructors();
        const sub = await courseTable.getSubjects();
        const sec = await sectionTable.getSections();
        res.status(201).json({prof,sub,sec});     
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }
}
