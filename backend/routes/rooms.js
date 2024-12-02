const express = require("express");
const router = express.Router();
const con = require("../config/db"); // Database connection

// Fetch room statuses
router.post("/room-status", (req, res) => {
  const { building_names, room_purpose } = req.body;
  const currentDate = new Date().toISOString().split("T")[0];

  console.log("-------------------------------");
  console.log("Incoming Request Payload:", { building_names, room_purpose });
  console.log("Using Current Date:", currentDate);

  const results = {
    occupiedCount: 0,
    vacantCount: 0,
    occupiedRooms: [],
    vacantRooms: [],
    scheduledVacantRooms: [],
  };

  const handleError = (error, message) => {
    console.error("Error Message:", message);
    console.error("Error Details:", error);
    res.status(500).json({ message });
  };



  const fetchOccupiedCount = () =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(DISTINCT room_id) AS occupied_count
        FROM rooms
        WHERE status = 'occupied'
          AND bldg_name IN (?)
          ${room_purpose ? "AND room_purpose = ?" : ""}`;
      const params = room_purpose ? [building_names, room_purpose] : [building_names];
      con.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        results.occupiedCount = rows[0]?.occupied_count || 0;
        resolve();
      });
    });

  const fetchVacantCountAndDetails = () =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT r.room_id, r.room_name
        FROM rooms r
        WHERE status = 'vacant'
        AND r.bldg_name IN (?)
          ${room_purpose ? "AND r.room_purpose = ?" : ""};`;
      const params = room_purpose ? [building_names, room_purpose] : [building_names];
      con.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        results.vacantCount = rows.length || 0;
        results.vacantRooms = rows;
        resolve();
      });
    });

  const fetchRoomDetails = (tag) =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT room_id, room_name
        FROM rooms
        WHERE status = ?
          AND bldg_name IN (?)
          ${room_purpose ? "AND room_purpose = ?" : ""}`;
      const params = room_purpose ? [tag, building_names, room_purpose] : [tag, building_names];
      con.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        if (tag === "occupied") {
          results.occupiedRooms = rows;
        } 
        resolve();
      });
    });
  const fetchScheduledVacantRooms = () => {
    return new Promise((resolve, reject) => {
      const sql = `
       SELECT DISTINCT(room_name)         FROM rooms  join section_schedules using(room_id) WHERE CURRENT_TIME BETWEEN time_start AND time_end
          AND status = 'vacant' AND bldg_name IN (?)
          ${room_purpose ? "AND room_purpose = ?" : ""}`;
      const params = room_purpose ? [ building_names, room_purpose] : [ building_names];
      con.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        
          results.scheduledVacantRooms = rows;
        
        resolve();
      });
    })
  }

  fetchOccupiedCount()
    .then(fetchVacantCountAndDetails)
    .then(() => fetchRoomDetails("occupied"))
    .then(() => fetchRoomDetails("vacant"))
    .then(() => fetchScheduledVacantRooms())
    .then(() => {
      console.log("Results:", results);
      res.status(200).json(results);
    })
    .catch((err) => handleError(err, "Error fetching room data"));
});

// Fetch distinct room purposes
router.get("/get-room-purposes", (req, res) => {
  const sql = `SELECT DISTINCT room_purpose FROM rooms`;
  con.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching room purposes" });
    }
    res.status(200).json(rows.map((row) => row.room_purpose));
  });
});

module.exports = router;
