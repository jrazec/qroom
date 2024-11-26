const userTable = require('./../models/Account');
const courseTable = require('./../models/Course');

exports.all = async (req,res) =>{
    try {
        const prof = await userTable.getInstructors();
        const sub = await courseTable.getSubjects();
        res.status(201).json({prof,sub});     
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }
}
