const con = require('../config/db');

class courseTable {
    static getSubjects() {
        return new Promise((resolve, reject) => {
            let queryCourses = `SELECT * FROM courses;`;

            con.query(queryCourses, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    resolve(result);    
                }
            });
        });
    }
}

module.exports = courseTable;
