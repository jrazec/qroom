const con = require('../config/db');

class userTable {
    static getAccounts() {
        return new Promise((resolve, reject) => {
            let queryUsers = `SELECT * FROM Users;`;
    
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
    static postAccount(data) {
        return new Promise((resolve, reject) => {
            const addUsers = `INSERT INTO Users(user_name,first_name,middle_name,last_name,password,role)
                            VALUES(?,?,?,?,?,?);`;
            const userData = [`${data.userName}`,`${data.firstName}`,`${data.middleName}`,`${data.lastName}`,`${data.password}`,`${data.role}`];
            con.query(addUsers,userData, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    resolve(result);    
                }
            });
        });
    }
    static putAccount(data){
        return new Promise((resolve,reject)=>{
            const editUsers = `UPDATE Users
                                SET user_name=?, first_name=?,middle_name=?,last_name=?,password=?,role=?
                                WHERE user_name=?;`;
            const userData = [`${data.newUserName}`,`${data.firstName}`,`${data.middleName}`,`${data.lastName}`,`${data.password}`,`${data.role}`,`${data.userName}`];
                con.query(editUsers,userData, (err, result) => {
                  if (err) {
                    console.error(err);
                    reject(err);  
                  } else {
                    resolve(result);    
                  }
              });
        })
   
    }
    static deleteAccount(key){
        return new Promise((resolve,reject)=>{
            const deleteUsers = `DELETE FROM Users
                                 WHERE user_name=?;`;
            const userData = [`${key}`];
            con.query(deleteUsers,userData, (err, result) => {
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
    
            const queryUser = `SELECT * FROM Users WHERE user_name = ? AND password = ?`;
            con.query(queryUser, [uName, pass], (err, result) => {
                if (err) {
                    console.error('Database query error:', err);
                    return reject(err);  // Reject on database error
                }
    
                if (result.length === 0) {
                    // No user found, resolve with false status
                    return resolve({ status: false, message: 'Invalid username or password' });
                }
    
                // User found, return the user data with a success status
                resolve({ status: true, user: result[0] });
            });
        });
    }
}

module.exports = userTable;