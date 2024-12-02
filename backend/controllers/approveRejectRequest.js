const ReserveNotif = require('../models/ReserveNotif');

const approveRejectRequest = async (req, res) => {
    const { reqId,status } = req.body;

    try {
        const result = await ReserveNotif.updateOne(
            { id: reqId },
            { $set: { status: req.body.status } }
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.status(200).json({ message: 'Request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = approveRejectRequest;