import React, { useEffect, useState, useCallback } from "react";
import roomSearch from './RoomSearch.module.css';
import axios from 'axios';
import { useOccupancy } from "../OccupancyContext"; // Import the context

const RoomImageStatus = ({
  roomDetails = [{ room_name: 'Room Name Unavailable', room_id: null }],
  userRole = 'Student',
}) => {
  const { occupiedRoom, occupyRoom, unoccupyRoom } = useOccupancy(); // Use context
  const [userId, setUserId] = useState(null);

  // Set user ID from local storage and fetch room status initially
  useEffect(() => {
    const userName = localStorage.getItem('user_name');
    if (userName) {
      setUserId(userName);
    }

    const roomId = roomDetails[0]?.room_id;
    if (roomId) {
      const occupiedState = localStorage.getItem(`room_${roomId}_occupied`);
      if (occupiedState !== null) {
        if (occupiedState === 'true') {
          occupyRoom({ room_id: roomId, room_name: roomDetails[0]?.room_name });
        } else {
          unoccupyRoom();
        }
      } else {
        fetchRoomStatus(roomId);
      }
    }
  }, [roomDetails, occupyRoom, unoccupyRoom]);

  // Fetch room status function (memoized using useCallback)
  const fetchRoomStatus = useCallback(async (roomId) => {
    try {
      console.log('Fetching status for Room ID:', roomId);
      const response = await axios.get(`/api/rooms/room/${roomId}`);
      if (response.status === 200) {
        const isOccupied = response.data.occupation_tag === 'Occupied';
        if (isOccupied) {
          occupyRoom({ room_id: roomId, room_name: roomDetails[0]?.room_name });
        } else {
          unoccupyRoom();
        }
      }
    } catch (error) {
      console.error('Error fetching room status:', error);
    }
  }, [occupyRoom, unoccupyRoom, roomDetails]);

  const handleOccupyRoom = async () => {
    try {
      const roomId = roomDetails[0]?.room_id;

      if (!roomId) {
        console.error('Error: Room ID is missing. Cannot update status.');
        alert('Room ID is missing. Cannot update status.');
        return;
      }

      if (!userId) {
        console.error('Error: User ID is missing. Cannot update status.');
        alert('User ID is missing. Cannot update status.');
        return;
      }

      const action = occupiedRoom?.room_id === roomId ? 'unoccupy' : 'occupy';

      const requestBody = {
        room_id: roomId,
        action,
        user_name: userId,
      };

      const response = await axios.post('/api/rooms/update-room-status', requestBody);

      if (response.status === 200) {
        if (action === 'occupy') {
          occupyRoom({ room_id: roomId, room_name: roomDetails[0]?.room_name });
        } else if (action === 'unoccupy') {
          unoccupyRoom();
        }
        console.log(`Room ${action} successful for Room ID: ${roomId}`);
      } else {
        console.error('Failed to update room status:', response.data.message);
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating room status:', error);
      alert('Failed to update room status. Please try again.');
    }
  };

  return (
    <div className={`col-md-5 text-center ${roomSearch.leftSection}`}>
      <div className={roomSearch.roomStatus}>
        <img
          src="https://picsum.photos/500/500"
          alt="Room Status"
          className={`${roomSearch.roomImage} img-fluid`}
        />
        <h2 className="mt-3">
          {roomDetails[0]?.room_name || 'Room Name Unavailable'}
        </h2>
        <p className={roomSearch.roomOccupied}>
          {occupiedRoom?.room_id === roomDetails[0]?.room_id ? 'Occupied' : 'Available'}
        </p>
        <p className={roomSearch.roomStatusLight}>
          {occupiedRoom?.room_id === roomDetails[0]?.room_id ? <span className="text-danger">●</span> : <span className="text-success">●</span>}
        </p>
        <button
          className={`btn mt-2 ${
            userRole.toLowerCase() === 'instructor' && (!occupiedRoom || occupiedRoom?.room_id === roomDetails[0]?.room_id)
              ? 'btn-primary'
              : 'btn-secondary'
          }`}
          onClick={handleOccupyRoom}
          disabled={
            !(userRole.toLowerCase() === 'instructor' && (!occupiedRoom || occupiedRoom?.room_id === roomDetails[0]?.room_id))
          }
        >
          {occupiedRoom?.room_id === roomDetails[0]?.room_id ? 'Unoccupy Room' : 'Occupy Room'}
        </button>
      </div>
    </div>
  );
};

export default RoomImageStatus;
