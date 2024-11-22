const express = require("express");
const router = express.Router();
const { checkRoomAvailability, checkProfessorAvailability, getAvailableRooms } = require("../controllers/schedulingUtils");

router.post("/check-availability", async (req, res) => {
    const { room_id, user_name, day, time_start, time_end } = req.body;

    try {
        const isRoomAvailable = await checkRoomAvailability(room_id, day, time_start, time_end);
        const isProfessorAvailable = await checkProfessorAvailability(user_name, day, time_start, time_end);

        res.json({
            roomAvailable: isRoomAvailable,
            professorAvailable: isProfessorAvailable,
        });
    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/available-rooms", async (req, res) => {
    const { day, time_start, time_end } = req.query;

    try {
        const rooms = await getAvailableRooms(day, time_start, time_end);
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
