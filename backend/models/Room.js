const con = require('../config/db');

class roomTable {

    static getLabAndRoom() {
        return new Promise((resolve, reject) => {
            const queryUser = `Select * from rooms where room_purpose IN ('Classroom','Laboratory');`
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
    static getRoom() {
        return new Promise((resolve, reject) => {
            const queryUser = `Select * from rooms where room_purpose IN  ('Laboratory','Classroom');`
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

    static getRoomSched() {
        return new Promise((resolve, reject) => {
            const queryUser = `select * from rooms join section_schedules using(room_id);`
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
    static getStatus(id,room_id) {
        return new Promise((resolve, reject) => {
            const queryUser = `select status,user_name from rooms left join occupations using(room_id) where room_id= ?;`
            con.query(queryUser, [room_id], (err, results) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);  // Reject on database error
                }    
                console.log(results)
                // User found, return the user data with a success status
                resolve(results);
            });
        });
    }

}



module.exports = roomTable;