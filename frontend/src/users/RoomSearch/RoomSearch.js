import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import RoomImageStatus from './RoomImageStatus';
import RoomDetails from './RoomDetails';
import roomSearch from './RoomSearch.module.css';
import { getRoom, getUserSchedule, getRoomSpecific } from '../../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../sched-bar/schedBarModules';
import axios from 'axios';

function RoomSearch() {
  const [schedule, setSchedule] = useState([]);
  const [userDetails, setUserDetails] = useState([{ room_name: 'Placeholder Room', room_id: null }]); // Default data
  const [roomOccupied, setRoomOccupied] = useState(false);
  const [userRole, setUserRole] = useState('Instructor'); // Default role
  const [roomStatus, setRoomStatus] = useState('Available'); // Default status
  const [reservationStatus, setReservationStatus] = useState('');
  const [currentSchedule, setCurrentSchedule] = useState([]);
  const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Ensure this stays in the component

  const { roomid, id } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem('user_id'); // Assume you store user_id in localStorage

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user_name');

    if (!token) {
      navigate('/user/login');
      return;
    }

    if (id !== loggedInUser) {
      alert('Access forbidden');
      navigate('/not-found');
      return;
    }

    if (roomid) {
      fetchRoomDetails(roomid);
    }
  }, [roomid, id, navigate]);

  // Function to fetch room details from the backend
  const fetchRoomDetails = async (roomId) => {
    try {
      console.log('Fetching details for Room ID:', roomId); // Logging Room ID for debugging

      const response = await axios.get(`/api/rooms/room/${roomId}`);
      if (response.status === 200) {
        const roomData = response.data;
        setUserDetails([roomData]); // Update user details with fetched room data
        setRoomStatus(roomData.status || 'Available'); // Set the room status
        setRoomOccupied(roomData.status === 'Occupied'); // Set roomOccupied state

        console.log('Fetched Room Details:', roomData);
      } else {
        console.warn('Room details not found for Room ID:', roomId);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const handleToggleOccupancy = async () => {
    try {
      const roomId = userDetails[0]?.room_id;
      if (!roomId) {
        alert('Room ID is missing. Cannot update status.');
        return;
      }

      console.log('Attempting to toggle room status. Room ID:', roomId);

      const action = roomOccupied ? 'unoccupy' : 'occupy';

      const response = await axios.post('/api/rooms/update-room-status', {
        room_id: roomId,
        action,
        user_id: userId, // Include the userId when toggling occupancy
      });

      if (response.status === 200) {
        setRoomOccupied(!roomOccupied);
        setRoomStatus(roomOccupied ? 'Available' : 'Occupied');
        console.log(`Room ${action} successful for Room ID: ${roomId}`);
      } else {
        console.error('Failed to update room status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating room status:', error);
    }
  };

  return (
    <div className={roomSearch.app}>
      <Navbar id={id} />
      <main className={roomSearch.mainContent}>
        <div className={roomSearch.backButton}>
          <button className="btn btn-link">
            <i className="fa fa-arrow-left"></i> Back
          </button>
        </div>
        <div className={`row justify-content-center align-items-center ${roomSearch.mainLayout} mt-1`}>
          <RoomImageStatus
            roomDetails={userDetails}
            roomStatus={roomStatus}
            roomOccupied={roomOccupied}
            handleToggleOccupancy={handleToggleOccupancy}
            reservationStatus={reservationStatus}
            userRole={userRole}
            setRoomOccupied={setRoomOccupied}
            setRoomStatus={setRoomStatus}
            userId={userId} // Pass userId to RoomImageStatus
          />
          <RoomDetails userDetails={userDetails} schedule={schedule} dayMap={dayMap} />
        </div>
      </main>
    </div>
  );
}

export default RoomSearch;
