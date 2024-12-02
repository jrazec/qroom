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

   // Method to create a new section in the sections table
  static createSection(sectionName, program_name, start_month, end_month) {
    return new Promise((resolve, reject) => {
      const addSection = `INSERT INTO sections(section_name, program_name, start_month, end_month)
                          VALUES(?,?,?,?);`;

      const sectionData = [sectionName, program_name, start_month, end_month];
      con.query(addSection, sectionData, (err, result) => {
        if (err) {
          console.error("Error adding section:", err);
          reject(err);  
        } else {
          resolve(result);    
        }
      });
    });
  }

  // Method to delete a section from the section_schedules table (assuming section_id exists)
  static deleteSection(sectionId) {
    return new Promise((resolve, reject) => {
      const deleteSection = `DELETE FROM section_schedules WHERE section_sched_id = ?;`;

      con.query(deleteSection, [sectionId], (err, result) => {
        if (err) {
          console.error("Error deleting section:", err);
          reject(err);  
        } else {
          resolve(result);    
        }
      });
    });
  }

  // Method to assign sections to a user (adding to the user_section_schedules table)
  static assignSectionsToUser(userName, sectionIds) {
    return new Promise((resolve, reject) => {
      // Construct the values to be inserted into the user_section_schedules table
      const values = sectionIds.map(sectionId => [userName, sectionId]);
      const query = 'INSERT INTO user_section_schedules (user_name, section_sched_id) VALUES ?';

      con.query(query, [values], (err, result) => {
        if (err) {
          console.error("Error assigning sections to user:", err);
          reject(err);  
        } else {
          resolve(result);    
        }
      });
    });
  }

  // Fetch sections by department (if needed)
  static getSectionsByDepartment(department) {
    return new Promise((resolve, reject) => {
      const query = `SELECT section_name FROM sections WHERE department = ?`;
      con.query(query, [department], (err, result) => {
        if (err) {
          console.error("Error fetching sections by department:", err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
  
}

module.exports = sectionTable;