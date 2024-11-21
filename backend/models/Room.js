const con = require('../config/db');

class roomTable {

    static getLabAndRoom() {
        return new Promise((resolve, reject) => {
            const queryUser = `Select room_id, room_name from rooms where room_purpose IN ('Classroom','Laboratory');`
            con.query(queryUser, (err, results) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);  // Reject on database error
                }    
                if (results.length === 0) {
                    // No user found, resolve with false status
                    return resolve({ status: false, message: 'No Room' });
                }    
                // User found, return the user data with a success status
                resolve({ status: true, results:results });
            });
        });
    }
    
        

}



module.exports = roomTable;