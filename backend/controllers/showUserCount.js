const userTable = require('./../models/Account');

exports.instructorCount = async (req, res) => {
    try {
        const result = await userTable.getInstructorCount();
        console.log('Instructor Count--:', result);  // Log the count result for debugging
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }
}

exports.studentCount = async (req, res) => {
    try {
        const result = await userTable.getStudentCount();
        console.log('Student Count--:', result);  // Log the count result for debugging
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }
}