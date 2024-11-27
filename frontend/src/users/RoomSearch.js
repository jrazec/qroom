import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import roomSearch from './RoomSearch.module.css'; // Import the CSS module
import { getRoom } from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule } from '../api/api';
import { convertTimeToPosition, fetchData } from './sched-bar/schedBarModules';
import { getRoomSpecific } from '../api/api';

function RoomSearch() {
  const [schedule, setSchedule] = useState([]); // State to hold dynamic schedule information
  const [userDetails, setUserDetails] = useState([]); // State for multiple user details
  const [roomOccupied, setRoomOccupied] = useState(false); // State for room occupancy
  const [userRole, setUserRole] = useState(''); // State for user role, default to 'student'
  const [roomStatus, setRoomStatus] = useState(''); // State for room status
  const [reservationStatus, setReservationStatus] = useState(''); // State for reservation status
  const [currentSchedule, setCurrentSchedule] = useState([]); // State for current schedule

  const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Map days to their index positions
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const { roomid, id, floorid } = useParams();
  const navigate = useNavigate();

  // Mapping for building IDs to their respective image files
  const buildingImages = {
    1: "/assets/lsb.png", // LEONOR SOLIS BUILDING
    2: "/assets/vmb.png", // VALERIO MALABANAN BUILDING
    3: "/assets/abb.png", // ANDRES BONIFACIO BUILDING
    4: "/assets/gzb.png", // GREGORIO ZARA BUILDING
  };

  const [buildingImage, setBuildingImage] = useState(""); // State to hold the image URL

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user_name'); // Get logged-in user's username from localStorage

    if (!token) {
      // If no token, redirect to login page
      navigate('/user/login');
      return;
    }

    // If the user is trying to access another user's page
    if (id !== loggedInUser) {
      alert("Access forbidden");
      navigate('/not-found'); // Redirect to the homepage or NotFound page
      return;
    }

    // Dynamically set the building image based on the selected building (floorid)
    if (buildingImages[floorid]) {
      setBuildingImage(buildingImages[floorid]);
    }

    // Fetch room and user details for the specific room
    if (roomid) { // Ensure roomid is defined before fetching
      fetchData(roomid, getRoom, setSchedule, setUserDetails, getUserSchedule, setUserRole, id);
      if (schedule.length >= 1) {
        getRoomSpecific(roomid, setCurrentSchedule);
      }
    }
  }, [roomid, id, floorid, navigate]);

  // Handle room occupancy toggle
  const handleToggleOccupancy = (e) => {
    if (userRole.toLowerCase() === 'instructor') {
      const currentTime = new Date();
      const currentDay = days[currentTime.getDay()];
      const currentHour = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;

      // Determine the user's schedule status
      let userSchedule;

      if (
        currentSchedule.find(
          (item) =>
            id === item.user_name &&
            item.day === currentDay &&
            item.time_start <= currentHour &&
            item.time_end >= currentHour
        )
      ) {
        userSchedule = 'scheduled';
      } else if (
        currentSchedule.find(
          (item) =>
            item.day === currentDay &&
            item.time_start <= currentHour &&
            item.time_end >= currentHour
        )
      ) {
        userSchedule = 'waiting';
      } else {
        userSchedule = 'none';
      }

      // Handle room status based on user schedule
      if (userSchedule === 'scheduled') {
        if (roomOccupied) {
          setRoomOccupied(false);
          setRoomStatus('Scheduled but not Occupied');
        } else {
          setRoomOccupied(true);
          setRoomStatus('Occupied');
        }
      } else if (userSchedule === 'waiting') {
        if (roomOccupied) {
          setRoomOccupied(false);
          setRoomStatus('Vacant');
          setReservationStatus('Waiting');
        } else {
          setRoomOccupied(true);
          setRoomStatus('Reserved');
          setReservationStatus('Waiting');
        }
      } else {
        if (roomOccupied) {
          setRoomOccupied(false);
          setRoomStatus('Vacant');
        } else {
          setRoomOccupied(true);
          setRoomStatus('Occupied');
        }
      }
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
          {/* Left Section - Room Image and Status */}
          <div className={`col-md-5 text-center ${roomSearch.leftSection}`}>
            <div className={roomSearch.roomStatus}>
              {/* Replace with dynamic building image */}
              <img
                src={buildingImage} // Dynamically load the building image based on the selected floorid
                alt="Building"
                className={`${roomSearch.roomImage} img-fluid`}
              />
              <h2 className="mt-3">{userDetails[0]?.room_name}</h2>
              <p className={roomSearch.roomOccupied}>{roomStatus}</p>
              <p className={roomSearch.roomStatusLight}>
                {roomStatus === 'Occupied' && <span className="text-danger">●</span>}
                {roomStatus === 'Scheduled but not Occupied' && <span className="text-warning">●</span>}
                {roomStatus === 'Vacant' && <span className="text-success">●</span>}
              </p>
              <button
                className={`btn mt-2 ${userRole.toLowerCase() === 'student' ? 'btn-secondary' : 'btn-primary'}`}
                onClick={handleToggleOccupancy}
                disabled={userRole.toLowerCase() === 'student'} // Disable button for students
              >
                {roomOccupied ? 'Unoccupy Room' : 'Occupy Room'} {/* Toggle button text */}
              </button>
              {reservationStatus && <p className="mt-2">{reservationStatus}</p>}
            </div>
          </div>

          {/* Right Section - Schedule and User Details */}
          <div className={`col-md-6 ${roomSearch.rightSection}`}>
            {/* Schedule Wrapper */}
            <div className={roomSearch.scheduleWrapper}>
              {/* User Details */}
              <div className={roomSearch.leftSched}>
                {userDetails === undefined ? (
                  <p>No Schedule Yet</p>
                ) : (
                  userDetails.map((user, index) => (
                    <div key={index} className={`${roomSearch.scheduleUser} mb-3`}>
                      <img
                        src={user.image}
                        alt="User"
                        style={{ objectFit: 'cover' }}
                        className={`${roomSearch.userImage} img-fluid`}
                      />
                      <div className={roomSearch.userDetails}>
                        <p><strong>Instructor:</strong> {user.first_name} {user.middle_name} {user.last_name}</p>
                        <p><strong>Section:</strong> {user.section_name}</p>
                        <p><strong>Time:</strong> {user.time_start} - {user.time_end}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Schedule Content */}
              <div className={roomSearch.scheduleContainer}>
                <div className={`${roomSearch.days} d-flex justify-content-between`}>
                  {dayMap.map((day, index) => (
                    <div key={index} className={roomSearch.dayLabel}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className={roomSearch.scheduleContent}>
                  {schedule === undefined ? 
                    <p>No schedule assigned.</p>
                  : schedule.map((item, index) => (
                    <div
                      key={index}
                      className={roomSearch.scheduleBlock}
                      style={{
                        top: `${convertTimeToPosition(item.time_start)}%`,
                        height: `${convertTimeToPosition(item.time_end) - convertTimeToPosition(item.time_start)}%`,
                        left: `${dayMap.indexOf(item.day) * 14.28}%`,
                      }}
                    >
                      <div className={roomSearch.topBlock}>
                        {item.time_start > 12.60
                          ? `${parseFloat(item.time_start - 12).toFixed(2)}`.replace('.', ':').concat('pm')
                          : `${item.time_start}`.replace('.', ':').concat('am')}
                      </div>
                      <div className={roomSearch.botBlock}>
                        {item.time_end > 12.60
                          ? `${parseFloat(item.time_end - 12).toFixed(2)}`.replace('.', ':').concat('pm')
                          : `${item.time_end}`.replace('.', ':').concat('am')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Optional Previous Button */}
            {/* <div className={roomSearch.previousButton}>
              <button className="btn btn-outline-dark">Previous</button>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomSearch;
