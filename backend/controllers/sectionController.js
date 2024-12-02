const con = require('../config/db'); // MySQL connection

// Fetch all sections from the database
const getSections = async (req, res) => {
  try {
    const query = 'SELECT section_name FROM sections'; // Fetch section_name from sections table
    const query2 = `select course_description,section_sched_id, concat(first_name,' ',middle_name,' ',last_name) as name,day,time_start,time_end,section_name from section_schedules join user_section_schedules using(section_sched_id) join users using(user_name) join sections using(section_name) join courses using(course_id) where role='instructor'; `
    con.query(query, (err, result) => {
      if (err) {
        console.error("Error fetching sections:", err);
        return res.status(500).json({ status: false, message: 'Failed to fetch sections' });
      }
      con.query(query2, (err, result2) => {
        if (err) {
          console.error("Error fetching sections:", err);
          return res.status(500).json({ status: false, message: 'Failed to fetch sections' });
        }
        res.json({ status: true, sections: result,sec_sched:result2 });
      })
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({ status: false, message: 'Failed to fetch sections' });
  }
};

// Fetch sections by department
const getSectionsByDepartment = async (req, res) => {
  const { department } = req.params; // Extract department from the request params

  if (!department) {
    return res.status(400).json({ status: false, message: 'Department is required' });
  }

  try {
    const query = `SELECT section_name FROM sections WHERE department = ?`;
    con.query(query, [department], (err, result) => {
      if (err) {
        console.error("Error fetching sections by department:", err);
        return res.status(500).json({ status: false, message: 'Failed to fetch sections for the department' });
      }

      res.json({ status: true, sections: result });
    });
  } catch (error) {
    console.error("Error fetching sections by department:", error);
    res.status(500).json({ status: false, message: 'Failed to fetch sections for the department' });
  }
};

// Fetch section schedules for a specific section
const getSectionSchedules = async (req, res) => {
  const { section_name } = req.params;

  console.log('Requested section_name:', section_name);  // Log the incoming section name

  if (!section_name) {
    return res.status(400).json({ status: false, message: 'Section name is required' });
  }

  const query = 'SELECT section_sched_id, section_name, room_id, day, time_start, time_end, course_id FROM section_schedules WHERE section_name = ?';
  
  console.log('Executing query:', query);  // Log the query being executed

  try {
    const result = await new Promise((resolve, reject) => {
      con.query(query, [section_name], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    if (result.length === 0) {
      console.log('No schedules found for:', section_name);
      return res.status(404).json({ status: false, message: 'No schedules found for this section' });
    }

    console.log('Schedules found:', result);  // Log the result returned by the query
    return res.json({ status: true, schedules: result });

  } catch (err) {
    console.error("Error fetching section schedules:", err);
    return res.status(500).json({ status: false, message: 'Failed to fetch section schedules' });
  }
};

// Add sections to a user
const addSectionsToUser = async (req, res) => {
  const { userName, sections } = req.body;
  console.log("Received userName:", userName);
  console.log("Received sections:", sections);

  if (!userName || !sections || sections.length === 0) {
    return res.status(400).json({ status: false, message: 'Invalid user name or sections' });
  }

  try {
    // Insert sections into user_section_schedules
    const promises = sections.map(async (sectionId) => {
      const query = `SELECT section_sched_id FROM section_schedules WHERE section_sched_id = ?`;
      const result = await new Promise((resolve, reject) => {
        con.query(query, [sectionId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      if (result.length === 0) {
        console.error("Section not found:", sectionId);
        throw new Error('Invalid section');
      }

      const insertQuery = `INSERT INTO user_section_schedules (user_name, section_sched_id) VALUES (?, ?)`;
      await new Promise((resolve, reject) => {
        con.query(insertQuery, [userName, sectionId], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    await Promise.all(promises); // Wait for all sections to be inserted
    return res.status(200).json({ status: true, message: 'Sections added successfully' });

  } catch (error) {
    console.error("Error adding sections:", error);
    return res.status(500).json({ status: false, message: 'Failed to add sections' });
  }
};

// Fetch departments from the 'users' table
const getDepartments = async (req, res) => {
  console.log("Request received for /departments");  // Log when the request hits this endpoint

  const query = 'SELECT DISTINCT department FROM users WHERE department IS NOT NULL AND department != ""';

  try {
    const result = await new Promise((resolve, reject) => {
      con.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    // Log the result to check what data is returned
    console.log("Departments fetched:", result);
    res.json({ status: true, departments: result });

  } catch (err) {
    console.error("Error fetching departments:", err);
    return res.status(500).json({ status: false, message: 'Failed to fetch departments' });
  }
};

// Add schedules for regular students
const addSchedulesForRegular = async (req, res) => {
  const { userName, sectionSchedIds } = req.body;
  console.log("Received userName:", userName);
  console.log("Received sectionSchedIds:", sectionSchedIds);

  if (!userName || !sectionSchedIds || sectionSchedIds.length === 0) {
    return res.status(400).json({ status: false, message: 'Invalid user name or section schedule IDs' });
  }

  try {
    const promises = sectionSchedIds.map(async (schedId) => {
      const query = `SELECT section_sched_id FROM section_schedules WHERE section_sched_id = ?`;
      const result = await new Promise((resolve, reject) => {
        con.query(query, [schedId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      if (result.length === 0) {
        console.error("Section schedule not found:", schedId);
        throw new Error('Invalid section schedule');
      }

      const insertQuery = `INSERT INTO user_section_schedules (user_name, section_sched_id) VALUES (?, ?)`;
      await new Promise((resolve, reject) => {
        con.query(insertQuery, [userName, schedId], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    await Promise.all(promises); // Wait for all schedules to be added
    return res.status(200).json({ status: true, message: 'Schedules added successfully' });

  } catch (error) {
    console.error("Error adding schedules for regular:", error);
    return res.status(500).json({ status: false, message: 'Failed to add schedules for regular students' });
  }
};

// Add schedules for irregular students
const addSchedulesForIrregular = async (req, res) => {
  const { userName, sectionSchedIds } = req.body;
  console.log("Received userName:", userName);
  console.log("Received sectionSchedIds:", sectionSchedIds);

  if (!userName || !sectionSchedIds || sectionSchedIds.length === 0) {
    return res.status(400).json({ status: false, message: 'Invalid user name or section schedule IDs' });
  }

  try {
    const promises = sectionSchedIds.map(async (schedId) => {
      const query = `SELECT section_sched_id FROM section_schedules WHERE section_sched_id = ?`;
      const result = await new Promise((resolve, reject) => {
        con.query(query, [schedId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });

      if (result.length === 0) {
        console.error("Section schedule not found:", schedId);
        throw new Error('Invalid section schedule');
      }

      const insertQuery = `INSERT INTO user_section_schedules (user_name, section_sched_id) VALUES (?, ?)`;
      await new Promise((resolve, reject) => {
        con.query(insertQuery, [userName, schedId], (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    await Promise.all(promises); // Wait for all schedules to be added
    return res.status(200).json({ status: true, message: 'Schedules added successfully' });

  } catch (error) {
    console.error("Error adding schedules for irregular:", error);
    return res.status(500).json({ status: false, message: 'Failed to add schedules for irregular students' });
  }
};

const deleteSchedulesForUser = async (req, res) => {
    const { userName } = req.body;
  
    try {
      // Logic to remove all schedules for the student with the given userName
      const result = await db.query("DELETE FROM schedules WHERE user_name = ?", [userName]);
  
      if (result.affectedRows > 0) {
        return res.json({ status: true });
      } else {
        return res.json({ status: false });
      }
    } catch (error) {
      console.error("Error removing schedules:", error);
      return res.status(500).json({ status: false, message: "Internal server error." });
    }
  };

module.exports = {
  getSections,
  deleteSchedulesForUser,
  getSectionsByDepartment,
  getSectionSchedules,
  addSectionsToUser,
  getDepartments,
  addSchedulesForRegular,
  addSchedulesForIrregular,
};
