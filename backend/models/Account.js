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
            const addUsers = `INSERT INTO users(user_name, first_name, middle_name, last_name, password, role)
                            VALUES(?,?,?,?,?,?);`;

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
                        `${data.role}`
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
                                SET user_name=?, first_name=?, middle_name=?, last_name=?, password=?, role=?
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
                        `${data.userName}`
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
}

module.exports = userTable;
