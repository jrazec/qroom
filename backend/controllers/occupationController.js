
const scheduleTable = require('../models/Schedule'); // Assuming a model to handle schedules
const occupationTable = require('../models/Occupation')

exports.createOccupation = async (req, res) => {
  try {
    console.log(req.body);
    const result = await occupationTable.createOccupation(req.body);
    res.status(201).json({ message: 'Occupation created successfully', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create occupation' });
  }
};

exports.updateOccupationStatus = async (req, res) => {
  try {
    console.log(req.body);
    const { occupation_id, occupation_tag, occupation_end } = req.body;
    const result = await occupationTable.updateOccupationStatus(occupation_id, { occupation_tag, occupation_end });
    res.status(200).json({ message: 'Occupation updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update occupation status' });
  }
};

exports.getOccupations = async (req, res) => {
  try {
    const { room_id } = req.query;
    console.log(`Fetching occupations for room_id: ${room_id}`);
    const result = await occupationTable.getOccupationsByRoom(room_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch occupations' });
  }
};

exports.validateRoomOccupation = async (req, res) => {
  try {
    const { room_id, user_name } = req.body;
    const currentTime = new Date();
    const day = currentTime.toLocaleString('en-US', { weekday: 'long' });
    const timeString = currentTime.toTimeString().split(' ')[0];

    const schedule = await scheduleTable.getScheduleByRoomAndTime(room_id, day, timeString);

    if (schedule.status && schedule.results.length > 0) {
      const scheduledUser = schedule.results[0].user_name;

      if (scheduledUser === user_name) {
        // Allow occupation
        res.status(200).json({ message: 'User can occupy the room', status: 'allowed' });
      } else {
        // User can only reserve
        res.status(200).json({ message: 'User can reserve the room', status: 'reserve' });
      }
    } else {
      // No schedule, user can reserve
      res.status(200).json({ message: 'No schedule, user can reserve the room', status: 'reserve' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate room occupation' });
  }
};

exports.autoRevertOccupation = async (req, res) => {
  try {
    const currentTime = new Date();
    const day = currentTime.toLocaleString('en-US', { weekday: 'long' });
    const timeString = currentTime.toTimeString().split(' ')[0];
    const allSchedules = await scheduleTable.getAllSchedules(day, timeString);

    allSchedules.results.forEach(async (schedule) => {
      if (currentTime >= new Date(schedule.time_end)) {
        await occupationTable.updateOccupationStatus(schedule.occupation_id, {
          occupation_tag: 'Unoccupied',
          occupation_end: currentTime,
        });
        console.log(`Auto reverted occupation for room_id: ${schedule.room_id}`);
      }
    });

    res.status(200).json({ message: 'Auto revert completed successfully' });
  } catch (error) {
    console.error('Failed to auto revert occupations:', error);
    res.status(500).json({ error: 'Failed to auto revert occupations' });
  }
};

exports.getRoomOccup = async (req,res)=> {
  const {roomid} = req.query;
  try {
    const result = await occupationTable.getOccupationByRoomAndUser(roomid);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'No occupation found for the given room and user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room occupation' });
  }
   
}

exports.getUserOccupied = async (req,res)=> {
  const room_id = req.body.room_id;
  try {
    const result = await occupationTable.getOccupationByUser(room_id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'No occupation found for the given user' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user occupation' });
  }
   
}

exports.toggleOccupyRoom = async (req,res)=> {
  const {room_id, user_name} = req.body;
  try {
    const result = await occupationTable.toggleOccupyRoom(room_id, user_name);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle room occupation' });
  }   
}

exports.toggleUnoccupyRoom = async (req, res) => {
  const { room_id, user_name } = req.body;
  try {
    const result = await occupationTable.toggleUnoccupyRoom(room_id, user_name);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle room unoccupation' });
  }
};