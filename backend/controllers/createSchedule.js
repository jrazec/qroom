const scheduleTable = require('./../models/Schedule');
const userTable = require('./../models/Account');

exports.single = async (req,res) =>{
    try {

        const result = await scheduleTable.createSchedule(req.body);
        res.status(201).json({ message: "User deleted successfully", data: result });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });  // Send error response
    }
}

exports.section = async (req, res) => {
    try {
        const user_names = req.body.user_names;
        const section_name = req.body.section_name;
        console.log(user_names, section_name)
        const results = await userTable.assignUsersToSection(user_names, section_name);
        res.status(200).json({ status: true, results });
    } catch (error) {
        console.error('Error in single:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};






