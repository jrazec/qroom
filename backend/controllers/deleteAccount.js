const userTable = require('./../models/Account');

exports.single = async (req,res) =>{
    try {
        console.log(req.body.userName)
        const result = await userTable.deleteAccount(req.body.userName);
        res.status(201).json({ message: "User deleted successfully", data: result });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data' });  // Send error response
    }
}