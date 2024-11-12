const con = require('../config/db');

class scheduleTable {
    static getSingleSchedule(userName) {
        return new Promise((resolve, reject) => {
            const uName = userName;
            console.log(userName)
            const queryUser = ` select user_name,day,time_start,time_end,course_code,course_description,program,section_name,room_name,role from users join user_section_schedules using(user_name) join section_schedules using(section_sched_id) join courses using(course_id) join rooms using(room_id) where user_name=?`;
            con.query(queryUser, [uName], (err, result) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);  // Reject on database error
                }    
                if (result.length === 0) {
                    // No user found, resolve with false status
                    return resolve({ status: false, message: 'No Schedule Found' });
                }    
                // User found, return the user data with a success status
                resolve({ status: true, result:result });
            });
        });
    }
    static getRoom(rId) {
        return new Promise((resolve, reject) => {
            const roomId = rId;
            const queryUser = `select first_name,last_name,middle_name,course_code,course_description,section_name,day,room_name,time_start,time_end,image from users join user_section_schedules using(user_name) join section_schedules using(section_sched_id) join rooms using(room_id) join courses using(course_id) WHERE room_id = ? and role='instructor' order by day,room_name,time_start`
            con.query(queryUser, [roomId], (err, result) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);  // Reject on database error
                }    
                if (result.length === 0) {
                    // No user found, resolve with false status
                    return resolve({ status: false, message: 'No Schedule Found' });
                }    
                // User found, return the user data with a success status
                resolve({ status: true, result:result });
            });
        });
    }
    
        

}



module.exports = scheduleTable;