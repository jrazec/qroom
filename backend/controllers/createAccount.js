const userTable = require('./../models/Account');


exports.single = async (req,res) =>{
    try {
        console.log(req.body)
        const result = await userTable.postAccount(req.body);
        res.status(201).json({ message: "User added successfully", data: result });
    } catch (error) {
        res.status(500).json({ error: 'Duplicate Usernames are not allowed!' });  // Send error response
    }
}