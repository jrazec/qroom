// controllers/roomList.js

const con = require("../config/db");

exports.getRoomsByBuilding = async (req, res) => {
  const { building } = req.query;

  try {
    const query = `
      SELECT room_id, room_name, room_purpose, bldg_name, floor_number
      FROM rooms
      WHERE bldg_name = ?
    `;
    con.query(query, [building], (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: "Server error while retrieving rooms." });
      }
      res.status(200).json({ rooms: result });
    });
  } catch (error) {
    console.error("Error in getRoomsByBuilding:", error);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getBuildings = async (req, res) => {
    try {
      const query = `
        SELECT DISTINCT bldg_name AS building_name
        FROM rooms
      `;
      con.query(query, (err, result) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).json({ error: "Server error while retrieving buildings." });
        }
        res.status(200).json({ buildings: result });
      });
    } catch (error) {
      console.error("Error in getBuildings:", error);
      res.status(500).json({ message: "Server error." });
    }
  };