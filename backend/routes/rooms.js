const express = require('express');
const router = express.Router();
const con = require('../config/db'); // Use your existing connection

router.post('/room-status', (req, res) => {
  const { building_name } = req.body; // Removed room_purpose from payload
  const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  console.log('-------------------------------');
  console.log('Incoming Request Payload:', { building_name });
  console.log('Using Current Date:', currentDate);

  const results = {
    occupiedCount: 0,
    vacantCount: 0,
    occupiedRooms: [],
    vacantRooms: [],
    scheduledVacantRooms: [],
  };

  const handleError = (error, message) => {
    console.error('Error Message:', message);
    console.error('Error Details:', error);
    res.status(500).json({ message });
  };

  const fetchOccupiedCount = () =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(DISTINCT room_id) AS occupied_count
        FROM rooms
        JOIN occupations USING(room_id)
        WHERE occupation_tag = 'Occupied'
          AND DATE(occupation_end) = ?
          AND bldg_name = ?`;
      console.log('Executing SQL for Occupied Room Count:', sql);
      con.query(sql, [currentDate, building_name], (err, rows) => {
        if (err) return reject(err);
        results.occupiedCount = rows[0]?.occupied_count || 0;
        console.log('Occupied Room Count:', results.occupiedCount);
        resolve();
      });
    });

  const fetchVacantCountAndDetails = () =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT r.room_id, r.room_name
        FROM rooms r
        LEFT JOIN occupations o ON r.room_id = o.room_id
          AND DATE(o.occupation_end) = ?
          AND (o.occupation_tag = 'Occupied' OR o.occupation_tag = 'Scheduled')
        WHERE r.bldg_name = ?
          AND o.room_id IS NULL;`; // Fetch rooms that are not occupied or scheduled
      console.log('Executing SQL for Vacant Room Count and Details:', sql);
      con.query(sql, [currentDate, building_name], (err, rows) => {
        if (err) return reject(err);
        results.vacantCount = rows.length || 0; // Vacant count is the number of rows
        results.vacantRooms = rows; // Vacant room details
        console.log('Vacant Room Count:', results.vacantCount);
        console.log('Vacant Room Details:', results.vacantRooms);
        resolve();
      });
    });

  const fetchRoomDetails = (tag) =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT room_id, room_name
        FROM rooms
        JOIN occupations USING(room_id)
        WHERE occupation_tag = ?
          AND DATE(occupation_end) = ?
          AND bldg_name = ?`;
      console.log(`Executing SQL for ${tag} Room Details:`, sql);
      con.query(sql, [tag, currentDate, building_name], (err, rows) => {
        if (err) return reject(err);
        if (tag === 'Occupied') {
          results.occupiedRooms = rows;
        } else if (tag === 'Scheduled') {
          results.scheduledVacantRooms = rows;
        }
        console.log(`${tag} Room Details:`, rows);
        resolve();
      });
    });

  fetchOccupiedCount()
    .then(fetchVacantCountAndDetails)
    .then(() => fetchRoomDetails('Occupied'))
    .then(() => fetchRoomDetails('Scheduled'))
    .then(() => {
      console.log('Final Results:', results);
      res.status(200).json(results);
    })
    .catch((err) => handleError(err, 'Error fetching room data'));
});

module.exports = router;
