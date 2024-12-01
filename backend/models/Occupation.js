const con = require('../config/db');

class occupationTable {
  static createOccupation(occupationData) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO occupations (room_id, occupation_tag, occupation_start, occupation_end) VALUES (?, ?, ?, ?)`;
      const values = [
        occupationData.room_id,
        occupationData.occupation_tag,
        occupationData.occupation_start,
        occupationData.occupation_end,
      ];
      con.query(query, values, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        resolve({ status: true, message: 'Occupation created', insertId: results.insertId });
      });
    });
  }

  static updateOccupationStatus(occupationId, occupationData) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE occupations SET occupation_tag = ?, occupation_end = ? WHERE occupation_id = ?`;
      const values = [
        occupationData.occupation_tag,
        occupationData.occupation_end,
        occupationId,
      ];
      con.query(query, values, (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        resolve({ status: true, message: 'Occupation updated' });
      });
    });
  }

  static getOccupationsByRoom(roomId) {
    return new Promise((resolve, reject) => {
      console.log(roomId);
      const query = `select DISTINCT section_sched_id,room_id,day,time_start,time_end,user_name, concat(first_name,' ',middle_name,' ',last_name) as name from section_schedules join user_section_schedules using(section_sched_id) join users using(user_name) where room_id= ? and role = 'instructor';`;
      con.query(query, [roomId], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        if (results.length === 0) {
          return resolve({ status: false, message: 'No Occupations found' });
        }
        resolve({ status: true, results });
      });
    });
  }
  static getOccupationByRoomAndUser(roomId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM occupations WHERE room_id = ? AND occupation_tag = 'Occupied'`;
      con.query(query, [roomId], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        if (results.length === 0) {
          return resolve({ status: false, message: 'No Occupations found for the specified room and user' });
        }
        resolve({ status: true, results });
      });
    });
  }
  static getOccupationByUser(room_id) {
    return new Promise((resolve, reject) => {
      const query = `select * from occupations join rooms using(room_id) where status = 'occupied' and room_id=?`;
      con.query(query, [room_id], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        if (results.length === 0) {
          return resolve({ status: false, message: 'No Occupations found for the specified user' });
        }
        resolve({ status: true, results });
      });
    });
  }

  static toggleOccupyRoom(room_id, user_name) {
    return new Promise((resolve, reject) => {
      const query = `insert into occupations(room_id,occupation_start,occupation_end,user_name) values(?,CURRENT_TIMESTAMP(),NULL,?);`;
      const query2 = `UPDATE rooms SET status = 'occupied' WHERE room_id = ?;`;
      con.query(query, [room_id, user_name], (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err);
        }
        con.query(query2, [room_id], (err, results) => {
          if (err) {
            console.error('Database query error:', err);
            return reject(err);
          }
          resolve({ status: true, message: 'Room Occupied' });
        });
      });
    });
  }
}

module.exports = occupationTable;


