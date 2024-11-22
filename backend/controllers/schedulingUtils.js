// /controllers/schedulingUtils.js
const con = require("../config/db");

exports.checkRoomAvailability = async (room_id, day, time_start, time_end) => {
    const query = `
        SELECT * FROM section_schedules 
        WHERE room_id = ? 
        AND day = ? 
        AND (
            (time_start <= ? AND time_end > ?) OR
            (time_start < ? AND time_end >= ?)
        )
    `;
    const [rows] = await con.promise().query(query, [room_id, day, time_end, time_start, time_start, time_end]);
    return rows.length === 0; // Room is available if no conflicts
};

exports.checkProfessorAvailability = async (user_name, day, time_start, time_end) => {
    const query = `
        SELECT * FROM user_section_schedules uss
        JOIN section_schedules ss ON uss.section_sched_id = ss.section_sched_id
        WHERE uss.user_name = ? 
        AND ss.day = ? 
        AND (
            (ss.time_start <= ? AND ss.time_end > ?) OR
            (ss.time_start < ? AND ss.time_end >= ?)
        )
    `;
    const [rows] = await con.promise().query(query, [user_name, day, time_end, time_start, time_start, time_end]);
    return rows.length === 0; // Professor is available if no conflicts
};

exports.getAvailableRooms = async (day, time_start, time_end) => {
    const query = `
        SELECT * FROM rooms 
        WHERE room_id NOT IN (
            SELECT room_id FROM section_schedules 
            WHERE day = ? 
            AND (
                (time_start <= ? AND time_end > ?) OR
                (time_start < ? AND time_end >= ?)
            )
        )
    `;
    const [rooms] = await con.promise().query(query, [day, time_end, time_start, time_start, time_end]);
    return rooms;
};
