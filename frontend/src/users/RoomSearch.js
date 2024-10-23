import React, { useState,useEffect } from 'react';
import Navbar from './Navbar';
import roomSearch from './RoomSearch.module.css'; // Import the CSS module
import { getRoom } from '../api/api';
import { useParams } from 'react-router-dom';

function RoomSearch() {
  // State to hold dynamic schedule information
  const [schedule, setSchedule] = useState([
    { day: 'Mon', time_start: 7, time_end: 19 },
    { day: 'Tues', time_start: 9, time_end: 12 },
    { day: 'Wed', time_start: 8, time_end: 10 },
    { day: 'Thur', time_start: 13, time_end: 15 },
  ]);

  // State for multiple user details
  const [userDetails, setUserDetails] = useState([
    { user_name: 'John Doe', program: 'Computer Science', section: 'A1', time_start: '10:00 AM', time_end: '12:00 PM' },
    { user_name: 'Jane Smith', program: 'Information Technology', section: 'B2', time_start: '1:00 PM', time_end: '3:00 PM' },
    { user_name: 'Mark Lee', program: 'Electrical Engineering', section: 'C3', time_start: '8:00 AM', time_end: '10:00 AM' }
  ]);

  // Map days to their index positions
  const dayMap = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Convert time (7AM to 7PM) to percentage-based height for the rectangles
  const convertTimeToHeight = (start, end) => {
    const totalHours = 12; // 7AM to 7PM is 12 hours
    const blockStart = ((start - 7) / totalHours) * 100;
    const blockHeight = ((end - start) / totalHours) * 100;
    return { blockStart, blockHeight };
  };

  const convertTimeToPosition = (time) => ((time - 7) / 12) * 100;

  const {roomid} = useParams();
  useEffect(() => {
    const fetchData = async (roomid) => {
        try {
            console.log("Fetching data...");
            const fetchedData = await getRoom(roomid);
            console.log(fetchedData)
            setUserDetails(fetchedData.result)
            setSchedule(fetchedData.result)
        } catch (error) {
            console.error('Error fetching user schedule:', error);
        }
    };

    if (roomid) { // Ensure roomid is defined before fetching
        fetchData(roomid);
    }
  }, []); 

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
              <h2 className="mt-3">CECS 501</h2>
              <p className={roomSearch.roomOccupied}>OCCUPIED</p>
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
                    <p><strong>Section:</strong> {user.section_id}</p>
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
