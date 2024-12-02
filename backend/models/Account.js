const con = require('../config/db');
const bcrypt = require('bcrypt'); // Import bcrypt

class userTable {
    static getAccounts() {
        return new Promise((resolve, reject) => {
            let queryUsers = `SELECT * FROM users;`;

            con.query(queryUsers, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    resolve(result);    
                }
            });
        });
    }

    // Update the postAccount method to hash the password
    static postAccount(data) {
        return new Promise((resolve, reject) => {
            const addUsers = `INSERT INTO users(user_name, first_name, middle_name, last_name, password, role,department,email)
                            VALUES(?,?,?,?,?,?,?,?);`;

            // Hash the password before inserting it into the database
            bcrypt.hash(data.password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    reject(err);
                } else {
                    const userData = [
                        `${data.userName}`,
                        `${data.firstName}`,
                        `${data.middleName}`,
                        `${data.lastName}`,
                        hashedPassword, // Use the hashed password here
                        `${data.role}`,
                        `${data.department}`,
                        `${data.email}`
                    ];
                    con.query(addUsers, userData, (err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);  
                        } else {
                            resolve(result);    
                        }
                    });
                }
            });
        });
    }

    static putAccount(data){
        return new Promise((resolve, reject) => {
            const editUsers = `UPDATE users
                                SET user_name=?, first_name=?, middle_name=?, last_name=?, password=?, role=?,department=?,email=?
                                WHERE user_name=?;`;
            

            // Hash the new password if provided (you can also modify this logic to handle other cases like password not being changed)
            bcrypt.hash(data.password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    reject(err);
                } else {
                    const userData = [
                        `${data.newUserName}`,
                        `${data.firstName}`,
                        `${data.middleName}`,
                        `${data.lastName}`,
                        hashedPassword, // Use the hashed password here
                        `${data.role}`,
                        `${data.department}`,
                        `${data.email}`,
                        `${data.userName}`,

                    ];

                    con.query(editUsers, userData, (err, result) => {
                        if (err) {
                            console.error(err);
                            reject(err);  
                        } else {
                            resolve(result);    
                        }
                    });
                }
            });
        });
    }

    static deleteAccount(key) {
        return new Promise((resolve, reject) => {
            const deleteUsers = `DELETE FROM users
                                 WHERE user_name=?;`;

            const userData = [`${key}`];
            con.query(deleteUsers, userData, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    resolve(result);    
                }
            });
        });
    }

    static getSingleAccount(data) {
        return new Promise((resolve, reject) => {
            const uName = data.user_name;
            const pass = data.password;

            // Retrieve user with the provided username and password
            const queryUser = `SELECT * FROM users WHERE user_name = ?`;
            con.query(queryUser, [uName], (err, result) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);  // Reject on database error
                }

                if (result.length === 0) {
                    // No user found, resolve with false status
                    return resolve({ status: false, message: 'Invalid username or password' });
                }

                // Compare the stored hashed password with the provided password
                bcrypt.compare(pass, result[0].password, (err, isMatch) => {
                    if (err) {
                        console.error('Error comparing password:', err);
                        return reject(err);
                    }

                    if (!isMatch) {
                        return resolve({ status: false, message: 'Invalid username or password' });
                    }

                    // User found and password matched, return the user data
                    resolve({ status: true, user: result[0] });
                });
            });
        });
    }

    static getInstructors() {
        return new Promise((resolve, reject) => {
            let queryUsers = `SELECT user_name, CONCAT(first_name, ' ', middle_name, ' ',last_name) as name,department FROM users WHERE role='instructor';`;

            con.query(queryUsers, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    resolve(result);    
                }
            });
        });
    }   
    

    static getUsers() {
        return new Promise((resolve, reject) => {
            let queryWithSchedule = `SELECT DISTINCT user_name,first_name,last_name,middle_name, department,section_name FROM users LEFT JOIN user_section_schedules USING(user_name) LEFT JOIN section_schedules USING(section_sched_id) WHERE role LIKE '%tudent' AND section_name IS NOT NULL;`;
            let queryWithoutSchedule = `SELECT DISTINCT user_name,first_name,last_name,middle_name, department,section_name FROM users LEFT JOIN user_section_schedules USING(user_name) LEFT JOIN section_schedules USING(section_sched_id) WHERE role LIKE '%tudent' AND section_name IS NULL;`;

            con.query(queryWithSchedule, (err, resultWithSchedule) => {
                if (err) {
                    console.error(err);
                    return reject(err);  
                }

                con.query(queryWithoutSchedule, (err, resultWithoutSchedule) => {
                    if (err) {
                        console.error(err);
                        return reject(err);  
                    }

                    resolve({
                        withSchedule: resultWithSchedule,
                        withoutSchedule: resultWithoutSchedule
                    });
                });
            });
        });
    }

    static assignUsersToSection(user_names, section_name) {
        return new Promise((resolve, reject) => {
            const querySectionSchedIdPerSection = `SELECT DISTINCT section_sched_id FROM section_schedules WHERE section_name = ?;`;

            con.query(querySectionSchedIdPerSection, [section_name], (err, result) => {
                if (err) {
                    console.error(err);
                    return reject(err);  
                }

                const secSchedIds = result.map(row => row.section_sched_id);

                const insertPromises = user_names.map(user_name => {
                    const insertQuery = `INSERT INTO user_section_schedules (section_sched_id, user_name) VALUES (?, ?);`;
                    return new Promise((resolve, reject) => {
                        secSchedIds.forEach(secSchedId => {
                            con.query(insertQuery, [secSchedId, user_name], (err, result) => {
                                if (err) {
                                    console.error(err);
                                    return reject(err);  
                                }
                                resolve(result);
                            });
                        });
                    });
                });

                Promise.all(insertPromises)
                    .then(results => resolve(results))
                    .catch(err => reject(err));
            });
        });
    }

    static deleteSched(user_name) {
        return new Promise((resolve, reject) => {
            const deleteUsers = `DELETE FROM user_section_schedules
                                 WHERE user_name=?;`;

            const userData = [`${user_name}`];
            con.query(deleteUsers, userData, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    resolve(result);    
                }
            });
        });
    }

    static getInstructorCount() {
        return new Promise((resolve, reject) => {
            let queryUsers = `SELECT count(user_name) AS count FROM users WHERE role LIKE '%nstructor';`;
            con.query(queryUsers, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    // Check if result is not empty
                    if (result && result.length > 0) {
                        resolve(result[0].count);  // Ensure we return just the count value
                    } else {
                        resolve(0);  // In case no rows were found
                    }
                }
            });
        });
    }
    
    static getStudentCount() {
        return new Promise((resolve, reject) => {
            let queryUsers = `SELECT count(user_name) AS count FROM users WHERE role LIKE '%tudent';`;
            con.query(queryUsers, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    // Check if result is not empty
                    if (result && result.length > 0) {
                        resolve(result[0].count);  // Ensure we return just the count value
                    } else {
                        resolve(0);  // In case no rows were found
                    }
                }
            });
        });
    }
    
}

module.exports = userTable;
