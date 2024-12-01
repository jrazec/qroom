const con = require('../config/db');
const { deleteSched } = require('./Account');

class scheduleTable {
    static getSingleSchedule(userName) {
        return new Promise((resolve, reject) => {
            const uName = userName;
            console.log(userName)
            const queryUser = ` select user_name,day,time_start,time_end,course_code,course_description,section_name,room_name,role,section_sched_id from users join user_section_schedules using(user_name) join section_schedules using(section_sched_id) join courses using(course_id) join rooms using(room_id) where user_name=?`;
            con.query(queryUser, [uName], (err, result) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);
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
            const queryUser = `select first_name,last_name,middle_name,course_code,course_description,section_name,day,room_name,time_start,time_end,image,room_purpose,course_code from users join user_section_schedules using(user_name) join section_schedules using(section_sched_id) join rooms using(room_id) join courses using(course_id) WHERE room_id = ? and role='instructor' order by day,room_name,time_start`
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
    static getAllSchedules(day, currentTime) {
        return new Promise((resolve, reject) => {
          const query = `SELECT * FROM section_schedules WHERE day = ? AND time_end <= ?`;
          con.query(query, [day, currentTime], (err, results) => {
            if (err) {
              console.error('Database query error:', err);
              return reject(err);
            }
            resolve({ status: true, result: results });
          });
        });
      }
      static createSchedule(body) {
        return new Promise((resolve, reject) => {
          const {
            section_name, 
            room_id, 
            department, 
            course_id,
            day, 
            user_name, 
            time_start, 
            time_end, 
        } = body;

      const queryStudents = `SELECT DISTINCT(user_name) FROM users JOIN user_section_schedules USING(user_name) JOIN section_schedules USING(section_sched_id) WHERE section_name=? AND role LIKE '%tudent'`;
      con.query(queryStudents,[section_name], (err, students) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }

        const queryMaxId = `SELECT MAX(section_sched_id) AS maxId FROM section_schedules`;
                con.query(queryMaxId, (err, maxIdResult) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);
                }

                const section_sched_id = maxIdResult[0].maxId + 1;
                const insertScheduleQuery = `INSERT INTO section_schedules (section_sched_id, section_name, room_id, day, time_start, time_end, course_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
                con.query(insertScheduleQuery, [section_sched_id, section_name, room_id, day, time_start, time_end, course_id], (err, scheduleResult) => {
                    if (err) {
                    console.error('Database query error:', err);
                    return reject(err);
                    }

                    if (students.length === 0) {
                    const insertInstructorQuery = `INSERT INTO user_section_schedules (section_sched_id, user_name) VALUES (?, ?)`;
                    con.query(insertInstructorQuery, [section_sched_id, user_name], (err, instructorResult) => {
                        if (err) {
                        console.error('Database query error:', err);
                        return reject(err);
                        }
                        resolve({ status: true, result: instructorResult });
                    });
                    } else {
                    const studentValues = students.map(student => `(${section_sched_id}, '${student.user_name}')`).join(', ');
                    const insertUsersQuery = `INSERT INTO user_section_schedules (section_sched_id, user_name) VALUES (${section_sched_id}, '${user_name}'), ${studentValues}`;
                    con.query(insertUsersQuery, (err, usersResult) => {
                        if (err) {
                        console.error('Database query error:', err);
                        return reject(err);
                        }
                        resolve({ status: true, result: usersResult });
                    });
                    }
                });
                });
            });
        });

        }
    
    static deleteSchedule(section_sched_id) {
        return new Promise((resolve, reject) => {
          const query = `DELETE FROM user_section_schedules WHERE section_sched_id = ?;`;
          const query2 = `DELETE FROM section_schedules WHERE section_sched_id = ?;`;
          con.query(query, [parseInt(section_sched_id)], (err, result) => {
            if (err) {
              console.error('Database query error:', err);
              return reject(err);
            }
            con.query(query2, [parseInt(section_sched_id)], (err, result) => {
                if (err) {
                  console.error('Database query error:', err);
                  return reject(err);
                }
                resolve({ status: true, result: result });
              });

          });
        });
      }

      static getSectionSchedules(section_name) {
        return new Promise((resolve, reject) => {
          const query = `SELECT DISTINCT section_sched_id,section_name,day,room_id,room_name,time_start,time_end,course_id,course_code FROM section_schedules join rooms using(room_id) join courses using(course_id) WHERE section_name = ?`;
          con.query(query,[section_name], (err, result) => {
            console.log(query)
            console.log(result)
            if (err) {
              console.error('Database query error:', err);
              return reject(err);
            }
            if (result.length === 0) {
              return resolve({ status: false, message: 'No Schedule Found' });
            }

            resolve({ status: true, result: result });
          });
        });
      }
}



module.exports = scheduleTable;