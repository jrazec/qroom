const con = require('../config/db');

class sectionTable {
    static getSections() {
        return new Promise((resolve, reject) => {
            let querySections = `SELECT section_name FROM sections;`;

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

    static createSection(sectionName, program_name, start_month, end_month) {
        return new Promise((resolve, reject) => {
            const addSection = `INSERT INTO sections(section_name, program_name, start_month, end_month)
                            VALUES(?,?,?,?);`;

            const sectionData = [sectionName, program_name, start_month, end_month];
            con.query(addSection, sectionData, (err, result) => {
                if (err) {
                    console.error(err);
                    reject(err);  
                } else {
                    resolve(result);    
                }
            });
        });
    }

    static deleteSection(sectionId) {
        return new Promise((resolve, reject) => {
            const deleteSection = `DELETE FROM section_schedules WHERE section_sched_id = ?;`;

            con.query(deleteSection, [sectionId], (err, result) => {
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