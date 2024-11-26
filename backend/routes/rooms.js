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

  const cleanupPastData = () =>
    new Promise((resolve, reject) => {
      const sql = `
        DELETE FROM occupations
        WHERE TIME(occupation_end) <= '20:00:00' AND DATE(occupation_end) < CURRENT_DATE();`;
      con.query(sql, (err, result) => {
        if (err) return reject(err);
        console.log("Rows deleted:", result.affectedRows);
        resolve();
      });
    });

  const fetchOccupiedCount = () =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT COUNT(DISTINCT room_id) AS occupied_count
        FROM rooms
        JOIN occupations USING(room_id)
        WHERE occupation_tag = 'Occupied'
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
        LEFT JOIN occupations o ON r.room_id = o.room_id
          AND (o.occupation_tag = 'Occupied' OR o.occupation_tag = 'Scheduled')
        WHERE r.bldg_name IN (?)
          ${room_purpose ? "AND r.room_purpose = ?" : ""}
          AND o.room_id IS NULL;`;
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
        JOIN occupations USING(room_id)
        WHERE occupation_tag = ?
          AND DATE(occupation_end) >= CURRENT_DATE()
          AND bldg_name IN (?)
          ${room_purpose ? "AND room_purpose = ?" : ""}`;
      const params = room_purpose ? [tag, building_names, room_purpose] : [tag, building_names];
      con.query(sql, params, (err, rows) => {
        if (err) return reject(err);
        if (tag === "Occupied") {
          results.occupiedRooms = rows;
        } else if (tag === "Scheduled") {
          results.scheduledVacantRooms = rows;
        }
        resolve();
      });
    });

  cleanupPastData()
    .then(fetchOccupiedCount)
    .then(fetchVacantCountAndDetails)
    .then(() => fetchRoomDetails("Occupied"))
    .then(() => fetchRoomDetails("Scheduled"))
    .then(() => {
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

// Endpoint to toggle room occupancy
router.post("/toggle-room-status", (req, res) => {
  const { room_id, action } = req.body;

  const sql =
    action === "occupy"
      ? `INSERT INTO occupations (room_id, occupation_tag, occupation_start, occupation_end)
         VALUES (?, 'Occupied', NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR))`
      : `DELETE FROM occupations WHERE room_id = ? AND occupation_tag = 'Occupied'`;

  con.query(sql, [room_id], (err, result) => {
    if (err) {
      console.error("Error updating room status:", err);
      return res.status(500).json({ error: "Database Error" });
    }
    res.status(200).json({ success: true, affectedRows: result.affectedRows });
  });
});

// Endpoint to fetch scheduled rooms
router.get("/scheduled-rooms", (req, res) => {
  const sql = `
    SELECT r.room_id, r.room_name, ss.section_name, ss.time_start, ss.time_end, uss.user_name
    FROM section_schedules ss
    LEFT JOIN user_section_schedules uss ON ss.section_sched_id = uss.section_sched_id
    LEFT JOIN rooms r ON ss.room_id = r.room_id
    WHERE ss.day = DAYNAME(CURDATE())
      AND TIME(ss.time_start) <= CURRENT_TIME
      AND TIME(ss.time_end) > CURRENT_TIME;
  `;

  con.query(sql, (err, rows) => {
    if (err) {
      console.error("Database Error:", err);
      return res.status(500).json({ error: "Database Error" });
    }
    const scheduledRooms = rows.filter((row) => !row.isOccupied);
    const occupiedRooms = rows.filter((row) => row.isOccupied);
    res.status(200).json({ scheduledRooms, occupiedRooms });
  });
});

// Endpoint for room occupancy
router.post("/occupancy", (req, res) => {
  const { roomId, action } = req.body;

  let query;
  if (action === "occupy") {
    query = `
      INSERT INTO occupations (room_id, occupation_tag, occupation_start, occupation_end)
      VALUES (?, 'Occupied', NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR))`;
  } else if (action === "unoccupy") {
    query = `
      DELETE FROM occupations WHERE room_id = ? AND occupation_tag = 'Occupied'`;
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }

  con.query(query, [roomId], (err, results) => {
    if (err) {
      console.error("Error updating room occupancy:", err);
      return res.status(500).json({ message: "Error updating room occupancy" });
    }
    res.json({ success: true, message: "Room status updated successfully" });
  });
});

router.post("/occupy-room", (req, res) => {
  const { room_id } = req.body;

  // Step 1: Check if the user is already occupying any room
  const checkQuery = `
    SELECT * FROM occupations
    WHERE occupation_tag = 'Occupied' AND TIMESTAMP(occupation_end) IS NULL;
  `;

  con.query(checkQuery, (err, results) => {
    if (err) {
      console.error("Error checking current occupations:", err);
      return res.status(500).json({ message: "Error checking current occupations" });
    }

    // Step 2: If the user is already occupying a room, return an error
    if (results.length > 0) {
      return res.status(400).json({
        message: "You are already occupying another room. Please unoccupy it first.",
      });
    }

    // Step 3: Insert a new occupation record for the room being occupied
    const insertQuery = `
      INSERT INTO occupations (room_id, occupation_tag, occupation_start)
      VALUES (?, 'Occupied', NOW());
    `;

    con.query(insertQuery, [room_id], (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error inserting occupation:", insertErr);
        return res.status(500).json({ message: "Error occupying room" });
      }

      res.status(200).json({
        success: true,
        message: "Room successfully occupied",
        occupation_id: insertResult.insertId,
      });
    });
  });
});

router.post("/unoccupy-room", (req, res) => {
  const { room_id } = req.body;

  // Step 1: Update the `occupation_end` for the specified room
  const updateQuery = `
    UPDATE occupations
    SET occupation_end = NOW()
    WHERE room_id = ? AND occupation_tag = 'Occupied' AND TIMESTAMP(occupation_end) IS NULL;
  `;

  con.query(updateQuery, [room_id], (err, result) => {
    if (err) {
      console.error("Error updating occupation:", err);
      return res.status(500).json({ message: "Error unoccupying room" });
    }

    // Step 2: If no rows were affected, the room was not occupied
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Room is not currently occupied" });
    }

    res.status(200).json({ success: true, message: "Room successfully unoccupied" });
  });
});

router.post('/update-room-status', (req, res) => {
  const { room_id, action, user_name } = req.body;

  if (!room_id || !action || !user_name) {
    console.error('Missing parameters:', { room_id, action, user_name });
    return res.status(400).json({ message: 'Missing parameters' });
  }

  if (action === 'occupy') {
    const checkSql = `
      SELECT COUNT(*) AS count FROM occupations WHERE room_id = ? AND occupation_tag = 'Occupied'
    `;
    con.query(checkSql, [room_id], (err, results) => {
      if (err) {
        console.error('Error checking existing occupancy:', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (results[0].count > 0) {
        return res.status(400).json({ message: 'Room is already occupied' });
      }

      // Proceed to insert the occupancy record
      const insertSql = `
        INSERT INTO occupations (room_id, occupation_tag, occupation_start, occupation_end, user_name)
        VALUES (?, 'Occupied', NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR), ?)
      `;
      con.query(insertSql, [room_id, user_name], (err, result) => {
        if (err) {
          console.error('Error updating room status (occupy):', err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: `Room successfully occupied`, affectedRows: result.affectedRows });
      });
    });

  } else if (action === 'unoccupy') {
    const deleteSql = `
      DELETE FROM occupations
      WHERE room_id = ? AND occupation_tag = 'Occupied'
      LIMIT 1
    `;
    con.query(deleteSql, [room_id], (err, result) => {
      if (err) {
        console.error('Error updating room status (unoccupy):', err);
        return res.status(500).json({ message: 'Database error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'No occupancy found to remove for this room' });
      }
      res.status(200).json({ message: `Room successfully unoccupied`, affectedRows: result.affectedRows });
    });

  } else {
    return res.status(400).json({ message: 'Invalid action' });
  }
});


router.get('/rooms/:roomid', (req, res) => {
  const { roomid } = req.params;
  const sql = `SELECT * FROM rooms WHERE room_id = ?`;

  con.query(sql, [roomid], (err, result) => {
    if (err) {
      console.error('Error fetching room details:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.status(200).json(result[0]);
  });
});

router.get('/room/:room_id', (req, res) => {
  const roomId = req.params.room_id;

  const sql = `
    SELECT 
      rooms.room_id, 
      rooms.room_name, 
      rooms.room_purpose, 
      rooms.department, 
      rooms.bldg_name, 
      rooms.floor_number, 
      occupations.occupation_tag
    FROM rooms
    LEFT JOIN occupations ON rooms.room_id = occupations.room_id
    WHERE rooms.room_id = ?;
  `;

  con.query(sql, [roomId], (err, rows) => {
    if (err) {
      console.error('Error fetching room details:', err);
      return res.status(500).json({ message: 'Error fetching room details' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.status(200).json(rows[0]); // Send the room details
  });
});

// Fetch the room occupied by the user
// Backend route for fetching the room occupied by the user
// Assuming you're using Express
router.get('/user-occupied-room/:user_name', (req, res) => {
  const { user_name } = req.params;

  // SQL query to fetch the occupied room for a given user_name
  const sql = `
    SELECT r.room_id, r.room_name
    FROM occupations o
    JOIN rooms r ON o.room_id = r.room_id
    WHERE o.user_name = ? AND o.occupation_tag = 'Occupied'
    LIMIT 1;
  `;

  con.query(sql, [user_name], (err, rows) => {
    if (err) {
      console.error('Error fetching occupied room:', err);
      return res.status(500).json({ message: 'Error fetching occupied room' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No occupied room found for this user' });
    }

    res.status(200).json(rows[0]); // Send the occupied room details
  });
});



module.exports = router;
