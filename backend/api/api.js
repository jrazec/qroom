
const express = require('express');
const router = express.Router();
const occupationTable = require('../models/Occupation');

// ...existing code...

// Define the /rooms2 endpoint
router.get('/rooms2', async (req, res) => {
  try {
    const rooms = await occupationTable.getAllRooms();
    if (!rooms.status) {
      return res.status(404).json({ status: false, message: 'No rooms found' });
    }
    res.status(200).json({ status: true, rooms: rooms.results });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ status: false, message: 'Internal server error' });
  }
});

// ...existing code...

module.exports = router;