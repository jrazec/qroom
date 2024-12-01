const con = require('../config/db'); // Make sure to adjust the path to your db configuration

class sectionTable {

    static getSections() {
        return new Promise((resolve, reject) => {
            let querySections = `SELECT * FROM sections;`;

            con.query(querySections, (err, result) => {
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

module.exports = sectionTable;