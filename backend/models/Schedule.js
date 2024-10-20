const con = require('../config/db');

class scheduleTable {
    static getSingleSchedule(userName) {
        return new Promise((resolve, reject) => {
            const uName = userName;
            console.log(userName)
            const queryUser = `select user_name,day,time_start,time_end,course_code,course_description,program,section_id,room_name,role from Users join Schedules using(user_name) join Sections using(section_id) join Courses using(course_id) join Rooms using(room_id) where user_name=?;`;
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
}



module.exports = scheduleTable;