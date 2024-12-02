import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import roomSearch from './RoomSearch.module.css'; // Import the CSS module
import { getRoom } from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule } from '../api/api';
import { convertTimeToPosition, fetchData } from './sched-bar/schedBarModules';
import { getRoomSpecific } from '../api/api';
import {shortenDay} from './sched-bar/schedBarModules';
import AcceptReserve from './AcceptReserve';

function RoomSearch() {
  const [schedule, setSchedule] = useState([]); // State to hold dynamic schedule information
  const [userDetails, setUserDetails] = useState([]); // State for multiple user details
  const [roomOccupied, setRoomOccupied] = useState(false); // State for room occupancy
  const [userRole, setUserRole] = useState(''); // State for user role, default to 'student'
  const [roomStatus, setRoomStatus] = useState(''); // State for room status
  const [reservationStatus, setReservationStatus] = useState(''); // State for reservation status
  const [currentSchedule, setCurrentSchedule] = useState([]); // State for current schedule

  const dayMap = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Map days to their index positions
  const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const { roomid, id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduledOrVacant, setScheduledOrVacant] = useState(true);
  const [isActiv, setIsActiv] = useState(true);
  const [buttons, setButton] = useState('Disabled');

  const buttonOccupy = () => {
    return (
      <button
        className={`btn mt-2 ${userRole.toLowerCase() === 'student' ? 'd-none' : 'btn-primary'} ${isMobile ? 'mr-2' : ''} mb-2`} 
        onClick={handleOccupyRoom}
        disabled={userRole.toLowerCase() === 'student'} // Disable button for students
      >
        Occupy Room
      </button>
    )
  };
  const handleOccupyRoom = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_LOCALHOST}/user/occupy-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token in request header
      },
      body: JSON.stringify({
        user_name: id,
        room_id: roomid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status) {
          setStatus('occupied');
          setButton('Unoccupy');
        }
      })
      .catch((error) => console.error('Error:', error));
  }

  const buttonUnoccupy = () => {
    return (
      <button
        className={`btn mt-2 ${userRole.toLowerCase() === 'student' ? 'd-none' : 'btn-primary'} ${isMobile ? 'mr-2' : ''} mb-2`} 
        onClick={handleUnoccupyRoom}
        disabled={userRole.toLowerCase() === 'student'} // Disable button for students
      >
        Unoccupy Room
      </button>
    )
  };
  const handleUnoccupyRoom = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_LOCALHOST}/user/unoccupy-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token in request header
      },
      body: JSON.stringify({
        user_name: id,
        room_id: roomid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === 'Room unoccupied') {
          setStatus('vacant');
          setButton('Occupy');
        }
      })
      .catch((error) => console.error('Error:', error));
  }


  const buttonReserve = () => {
    return (
      <button
        className={`btn mt-2 ${userRole.toLowerCase() === 'student' ? 'd-none' : 'btn-primary'} ${isMobile ? 'mr-2' : ''} mb-2`} 
        onClick={handleReserveRoom}
        disabled={userRole.toLowerCase() === 'student'} // Disable button for students
      >
        Reserve Room
      </button>
    )
  };
  const handleReserveRoom = () => {
    const token = localStorage.getItem('token');
    fetch(`${process.env.REACT_APP_LOCALHOST}/user/reserve-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send token in request header
      },
      body: JSON.stringify({
        user_name: id,
        room_id: roomid,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.message === 'Room reserved') {
          setStatus('occupied');
          setButton('Unoccupy');
        }
      })
      .catch((error) => console.error('Error:', error));
  }

  const buttonDisabled = () => {
    return (
      <button
        style={{ cursor: 'not-allowed', backgroundColor: '#6c757d' }}
        className={`btn mt-2 ${userRole.toLowerCase() === 'student' ? 'd-none' : 'btn-primary'} ${isMobile ? 'mr-2' : ''} mb-2`} 
        disabled={true} // Disable button for students
      >
        Unavailable
      </button>
    )
  }

  const listButtons = {'Occupy': buttonOccupy, 'Unoccupy':buttonUnoccupy, 'Reserve':buttonReserve,'Disabled':buttonDisabled};

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Check if the screen width is <= 768px
    };

    handleResize(); // Call once to set initial state
    window.addEventListener('resize', handleResize); // Update state on resize

    return () => {
      window.removeEventListener('resize', handleResize); // Clean up listener on component unmount
    };
  }, []);

  useEffect(() => {
    // Check if the user is authenticated by looking for a token in localStorage
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
    if (roomid) { // Ensure roomid is defined before fetching
      fetchData(roomid, getRoom, setSchedule, setUserDetails, getUserSchedule, setUserRole, id);
      if(schedule.length >= 1) {
        getRoomSpecific(roomid, setCurrentSchedule);
      }
      console.log(currentSchedule,"setCurrentSchedule")
    }

    const pollData = () => {
      setLoading(true);
      fetch(`${process.env.REACT_APP_LOCALHOST}/user/room-status/${id}/${roomid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.status === 401) {
            // Token expired or invalid, redirect to login page
            localStorage.removeItem('token');
            localStorage.removeItem('user_name');
            navigate('/user/login');
            return;
          }
          return response.json();
        })
        .then((data) => {
          const roomStatus = data[0].status;
          setStatus(roomStatus);
          setScheduledOrVacant(roomStatus === 'vacant');
          
          // Call the second fetch based on roomStatus after setting status
          handleButtonState(roomStatus); // Call function to update button based on roomStatus
        })
        .catch((error) => {
          console.error('Error fetching room status:', error);
        });
    
    };
    
    const handleButtonState = (status) => {
      if (status === 'occupied') {
        fetch(`${process.env.REACT_APP_LOCALHOST}/user/get-user-occupied`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            room_id: roomid,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.results[0].user_name === id) {
              setButton('Unoccupy'); // Show unoccupy button
            } else {
              setButton('Disabled'); // Disable the button
            }
          })
          .catch((error) => console.error('Error fetching user-occupied data:', error));
      } else if (status === 'vacant') {
        const today = new Date();
        const currentDay = days[today.getDay()];
        const currentTime = today.getHours() + today.getMinutes() / 60;
        
        const todaySchedule = schedule.find(item =>
          item.day === shortenDay(currentDay) &&
          currentTime >= item.time_start &&
          currentTime <= item.time_end
        );
        console.log(todaySchedule,'S');
        if (todaySchedule) {
          if (todaySchedule.user_name === id) {
            setButton('Occupy'); // Show occupy button
          } else {
            setButton('Disabled'); // Show reserve button
          }
        } else {
          setButton('Occupy'); // Show reserve button
        }
      }
    };
    

    // Poll every 5 seconds
    const intervalId = setInterval(pollData, 1000);

    // Fetch initial data on mount
    pollData();

    // Clean up the interval when the component is unmounted or the token is invalidated
    return () => clearInterval(intervalId);
  }, [roomid, id, navigate,schedule.length]);

  const handleToggleOccupancy = (e) => {

    setIsActiv(!isActiv);
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

        <div 
        className={`row justify-content-center align-items-center ${roomSearch.mainLayout} mt-1`}
        >
          <div className={`col-md-5 text-center ${roomSearch.leftSection} ${isMobile ? 'mr-4 pr-3' : ''}`}>
            <div className={roomSearch.roomStatus}>
              <img
                src="https://picsum.photos/500/500"
                alt="Room Status"
                className={`${roomSearch.roomImage} img-fluid`}
              />
              <h2 className="mt-3">{userDetails[0]?.room_name}</h2>
              <p className={roomSearch.roomOccupied} style={{ color: status === 'vacant' ? 'green' : 'maroon' }}>{status}</p>
              <div>
              {listButtons[buttons]()}
              </div>
              
            </div>
          </div>

          {/* Right Section - Schedule and User Details */}
          <div className={`col-md-6 ${roomSearch.rightSection}`}>
            <div className={roomSearch.scheduleWrapper}>
            <div className={roomSearch.leftSched}>
              {/* Multiple User Details */}
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
              <div className={`${roomSearch.scheduleContainer} mt-5`}>
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
            
            {/* <div className={roomSearch.acceptReserveWrapper}>
              <AcceptReserve roomid={roomid} />
            </div> */}

            {/* Previous Button */}
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
