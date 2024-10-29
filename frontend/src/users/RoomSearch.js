import React, { useState,useEffect } from 'react';
import Navbar from './Navbar';
import roomSearch from './RoomSearch.module.css'; // Import the CSS module
import { getRoom } from '../api/api';
import { useParams } from 'react-router-dom';
import { getUserSchedule } from '../api/api';

import {convertTimeToPosition,fetchData} from './sched-bar/schedBarModules';

function RoomSearch() {
  // State to hold dynamic schedule information
  const [schedule, setSchedule] = useState([]);

  // State for multiple user details
  const [userDetails, setUserDetails] = useState([]);

  const [roomOccupied, setRoomOccupied] = useState(false); // <-- Added: State for room occupancy
  const [userRole, setUserRole] = useState(''); // <-- Added: State for user role, default to 'student'

  // Map days to their index positions
  const dayMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const {roomid} = useParams();
  const {id} = useParams();
  useEffect(() => {

    if (roomid) { // Ensure roomid is defined before fetching
        fetchData(roomid,getRoom,setSchedule,setUserDetails,getUserSchedule,setUserRole,id);
        // Mocking user role fetch. Replace this with actual role-checking logic.

    }
  }, []); 

  const handleToggleOccupancy = (e) => {
    if (userRole === 'instructor') {
      setRoomOccupied((prevOccupied) => !prevOccupied); // Toggle room occupancy
    }

  };

  return (
    <div className={roomSearch.app}>
      <Navbar />

      <main className={roomSearch.mainContent}>
        <div className={roomSearch.socialIcons}>
          <a href="#" className={roomSearch.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={roomSearch.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={roomSearch.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>

        <div className={roomSearch.backButton}>
          <button className="btn btn-link">
            <i className="fa fa-arrow-left"></i> Back
          </button>
        </div>

        <div className={`row justify-content-center align-items-center ${roomSearch.mainLayout} mt-5 pt-5`}>
          {/* Left Section - Room Image and Status */}
          <div className={`col-md-5 text-center ${roomSearch.leftSection}`}>
            <div className={roomSearch.roomStatus}>
              <img
                src="https://picsum.photos/500/500"
                alt="Room Status"
                className={`${roomSearch.roomImage} img-fluid`}
              />
              <h2 className="mt-3">cecs 501</h2>
              <p className={roomSearch.roomOccupied}>{roomOccupied ? 'OCCUPIED' : 'AVAILABLE'}</p> {/* <-- Added: Display room status */}
              
              <button
                className={`btn mt-2 ${userRole === 'Student' ? 'btn-secondary' : 'btn-primary'}`} 
                onClick={handleToggleOccupancy}
                disabled={userRole === 'Student'} // Disable button for students
              >
                {roomOccupied ? 'Unoccupy Room' : 'Occupy Room'} {/* Toggle button text */}
              </button>
              
            </div>
          </div>

          {/* Right Section - Schedule and User Details */}
          <div className={`col-md-6 ${roomSearch.rightSection} mx-4`}>
            <div className={roomSearch.scheduleWrapper}>
              {/* Multiple User Details */}
              {(userDetails === undefined) ?
                 <p>No Schedule Yet</p>
               : userDetails.map((user, index) => (
                <div key={index} className={`${roomSearch.scheduleUser} mb-3`}>
                  <img
                    src={`https://picsum.photos/150/150?random=${index}`}
                    alt="User"
                    className={`${roomSearch.userImage} img-fluid`}
                  />
                  <div className={roomSearch.userDetails}>
                    <p><strong>Instructor:</strong> {user.first_name} {user.middle_name} {user.last_name}</p>
                    <p><strong>Section:</strong> {user.section_name}</p>
                    <p><strong>Time:</strong> {user.time_start} - {user.time_end}</p>
                  </div>
                </div>
              ))}

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

            {/* Previous Button */}
            <div className={roomSearch.previousButton}>
              <button className="btn btn-outline-dark">Previous</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomSearch;
