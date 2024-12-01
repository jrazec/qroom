// controllers/roomsByFloor.js

const con = require("../config/db");

exports.getRoomsByFloor = async (req, res) => {
  const { building, floor } = req.query;

  try {
    console.log("Received building:", building); // Debugging
    console.log("Received floor:", floor);       // Debugging

    let query = `
      SELECT room_id, floor_number,room_name, room_purpose
      FROM rooms
      WHERE bldg_name = ?
    `;
    (floor) ? query += ` AND floor_number = ?;` : query += `;`;
    con.query(query, [building, floor], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: "Server error while retrieving rooms." });
      }
      console.log("Query result:", result);  // Debugging
      res.status(200).json({ rooms: result });
    });
  } catch (error) {
    console.error("Error in getRoomsByFloor:", error);
    res.status(500).json({ message: "Server error." });
  }
};
