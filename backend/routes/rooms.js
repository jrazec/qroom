const express = require('express');
const router = express.Router();
const con = require('../config/db'); // Database connection

// Fetch room statuses
router.post('/room-status', (req, res) => {
  const { building_names, room_purpose } = req.body; // Accept an array of building names and room purpose
  const currentDate = new Date().toISOString().split('T')[0]; // Current date (YYYY-MM-DD)

  console.log('-------------------------------');
  console.log('Incoming Request Payload:', { building_names, room_purpose });
  console.log('Using Current Date:', currentDate);

  const results = {
    occupiedCount: 0,
    vacantCount: 0,
    occupiedRooms: [],
    vacantRooms: [],
    scheduledVacantRooms: [],
  };

  // Error handler function
  const handleError = (error, message) => {
    console.error('Error Message:', message);
    console.error('Error Details:', error);
    res.status(500).json({ message });
  };

  // Fetch occupied room count
  const fetchOccupiedCount = () =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(DISTINCT room_id) AS occupied_count
        FROM rooms
        JOIN occupations USING(room_id)
        WHERE status = 'occupied'
          AND DATE(occupation_end) = ?
          AND bldg_name IN (?)
          ${room_purpose ? 'AND room_purpose = ?' : ''}`;
      const params = room_purpose
        ? [currentDate, building_names, room_purpose]
        : [currentDate, building_names];
      con.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        results.occupiedCount = rows[0]?.occupied_count || 0;
        console.log('Occupied Room Count:', results.occupiedCount);
        resolve();
      });
    });

  // Fetch vacant rooms and count
  const fetchVacantCountAndDetails = () =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT r.room_id, r.room_name
        FROM rooms r
        LEFT JOIN occupations o ON r.room_id = o.room_id
          AND DATE(o.occupation_end) = ?
          AND status = 'vacant'
        WHERE r.bldg_name IN (?)
          ${room_purpose ? 'AND r.room_purpose = ?' : ''}
          AND o.room_id IS NULL;`; // Fetch rooms that are not occupied or scheduled
      const params = room_purpose
        ? [currentDate, building_names, room_purpose]
        : [currentDate, building_names];
      con.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        results.vacantCount = rows.length || 0;
        results.vacantRooms = rows;
        console.log('Vacant Room Count:', results.vacantCount);
        console.log('Vacant Room Details:', results.vacantRooms);
        resolve();
      });
    });

  // Fetch room details based on a tag (Occupied or Scheduled)
  const fetchRoomDetails = (tag) =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT room_id, room_name
        FROM rooms
        JOIN occupations USING(room_id)
        WHERE status = ?
          AND DATE(occupation_end) = ?
          AND bldg_name IN (?)
          ${room_purpose ? 'AND room_purpose = ?' : ''}`;
      const params = room_purpose
        ? [tag, currentDate, building_names, room_purpose]
        : [tag, currentDate, building_names];
      con.query(sql, params, (err, rows) => {
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

  // Execute all queries in sequence
  fetchOccupiedCount()
    .then(fetchVacantCountAndDetails)
    .then(() => fetchRoomDetails('occupied'))
    .then(() => fetchRoomDetails('vacant'))
    .then(() => {
      console.log('Final Results:', results);
      res.status(200).json(results);
    })
    .catch((err) => handleError(err, 'Error fetching room data'));
});

// Fetch distinct room purposes
router.get('/get-room-purposes', (req, res) => {
  const sql = `SELECT DISTINCT room_purpose FROM rooms`;
  con.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching room purposes:', err);
      return res.status(500).json({ message: 'Error fetching room purposes' });
    }
    res.status(200).json(rows.map((row) => row.room_purpose));
  });
});

module.exports = router;
