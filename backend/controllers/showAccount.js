const userTable = require('./../models/Account');


exports.all = async (req,res) =>{
    try {
        const result = await userTable.getAccounts();
        res.status(201).json(result);     
    } catch (error) {
        res.status(500).json({ error: 'Error' });  // Send error response
    }
}

exports.single = async (req, res) => {
    try {
        const result = await userTable.getSingleAccount(req.body);
        if (result.status) {
            res.status(200).json({ status: true, user: result.user });
        } else {
            res.status(401).json({ status: false, message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error in single:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.with_withoutSchedule = async (req, res) => {
    try {
        const results = await userTable.getUsers();
        res.status(200).json({ status: true, results });

    } catch (error) {
        console.error('Error in single:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

