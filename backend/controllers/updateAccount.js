const userTable = require('./../models/Account');

exports.single = async (req,res) =>{
    try {
        console.log(req.body)
        const result = await userTable.putAccount(req.body);
        res.status(201).json({ message: "User updated successfully", data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to Update.' });  // Send error response
    }
}
     
