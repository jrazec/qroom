import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import roomSearch from './RoomSearch.module.css'; // Import the CSS module
import { getRoom, getRoomSpecific, getUserSchedule } from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { convertTimeToPosition, fetchData } from './sched-bar/schedBarModules';
import {shortenDay} from './sched-bar/schedBarModules';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
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
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarButton, setCalendarButton] = useState('See Calendar');
  const [modalData, setModalData] = useState(null); // State to hold modal data
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleEventClick = (info) => {
    const event = info.event;
    const userDetail = userDetails.find(user => user.course_code === event.title.split(' : ')[0]);

    if (userDetail) {
      setModalData({
        title: event.title,
        professor: `${userDetail.first_name} ${userDetail.middle_name} ${userDetail.last_name}`,
        start: event.start.toLocaleTimeString('en-PH', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Manila'
        }),
        end: event.end.toLocaleTimeString('en-PH', { 
          hour: '2-digit', 
          minute: '2-digit',
          timeZone: 'Asia/Manila'
        }),
        description: userDetail.course_description,
        section_name: userDetail.section_name,
      });
      setShowModal(true);
    }
  };

  // Modal component
  const Modal = ({ data, onClose }) => (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{data.title}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p><strong>Professor:</strong> {data.professor}</p>
            <p><strong>Time:</strong> {data.start} - {data.end}</p>
            <p><strong>Description:</strong> {data.description}</p>
            <p><strong>Section:</strong> {data.section_name}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
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

  const handleSeeCalendar = () => {
    if (isMobile) {
      setShowCalendar(!showCalendar);
      console.log('show', showCalendar, 'ismobile', isMobile);
    }
  };

  useEffect(() => {
    if (!isMobile) {
      setShowCalendar(false);
    }
    
    if (isMobile && showCalendar) {
      setCalendarButton('Hide Calendar');
    } else if (isMobile && !showCalendar) {
      setCalendarButton('See Calendar');
    }
  }, [isMobile]);


  const calendarEvents = schedule.map((item, index) => {
    
    const arrDay = [{'Sun':0},{'Mon':1},{'Tue':2},{'Wed':3},{'Thu':4},{'Fri':5},{'Sat':6}];
    const dayIndex = arrDay.find(day => day.hasOwnProperty(item.day))[item.day];

    // Calculate the target date for the event day
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + ((dayIndex - targetDate.getDay() + 7) % 7));

    // Convert time strings to actual Date objects
    const [startHour, startMinute] = item.time_start.split('.').map(Number);
    const [endHour, endMinute] = item.time_end.split('.').map(Number);

    const startDateTime = new Date(targetDate);
    startDateTime.setHours(startHour, startMinute, 0, 0);

    const endDateTime = new Date(targetDate);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    // Ensure startDateTime and endDateTime are valid
    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      console.error(`Invalid date or time: ${item.time_start} - ${item.time_end} on ${item.day}`);
      return null;  // Skip invalid events
    }

    // Log the events being generated for FullCalendar
    console.log(`Event for ${item.day} (${item.time_start} - ${item.time_end}):`, {
      start: startDateTime,
      end: endDateTime,
    });
  
    return {
      id: `event-${index}`,
      title: `${item.course_code} : ${item.section_name}`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString()
    };
  }).filter(event => event !== null);  // Filter out invalid events
  
  console.log('Calendar Events:', calendarEvents);

  const calendarConfig = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: "timeGridWeek",
    headerToolbar: false,
    dayHeaders: true,
    hiddenDays: [],
    dayHeaderFormat: { weekday: 'short' },
    dayHeaderContent: (arg) => (
      <div style={{
        color: 'white',
        fontWeight: 'bold',
        textDecorationLine: 'none',
        textDecoration: 'none',
        borderBottom: 'none',
        pointerEvents: 'none'
      }}>
        {arg.text}
      </div>
    ),
    firstDay: 0,
    slotMinTime: "06:00:00",
    slotMaxTime: "20:00:00",
    allDaySlot: false,
    selectable: false,
    selectMirror: true,
    selectOverlap: false,
    editable: false,
    eventColor: '#800000',
    events: calendarEvents,
    eventClick: handleEventClick,
    eventMouseEnter: (info) => {
      info.el.style.cursor = 'pointer';
    },
    height: '100%',
  };
  

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
  
console.log('sched', schedule)
  

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
            <div className={`${roomSearch.roomStatus} ${showCalendar ? 'd-none' : 'd-block'}`}>
              <img
                src="/assets/room.png"
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
              <button className={`${roomSearch.seeCalendar} ${isMobile ? 'd-block': 'd-none'}`} onClick={handleSeeCalendar}>{calendarButton}</button>
              <div className={`${roomSearch.leftSched} ${showCalendar ? 'd-none' : 'd-block'}`}>
                {/* Multiple User Details */}
                {userDetails === undefined ? (
                  <p>No Schedule Yet</p>
                ) : (
                  userDetails.map((user, index) => {
                    const formatTime = (time) => {
                      const [hour, minute] = time.split(':');
                      const hourInt = parseInt(hour, 10);
                      const period = hourInt >= 12 ? 'PM' : 'AM';
                      const formattedHour = hourInt % 12 || 12;
                      return `${formattedHour}:${minute} ${period}`;
                    };

                    return (
                      <div key={index} className={`${roomSearch.scheduleUser} mb-3`}>
                        <img
                          src={`${process.env.REACT_APP_LOCALHOST}/${user.image}`}
                          alt="User"
                          style={{ objectFit: 'cover' }}
                          className={`${roomSearch.userImage} img-fluid`}
                        />
                        <div className={roomSearch.userDetails}>
                          <p><strong>Instructor:</strong> {user.first_name} {user.middle_name} {user.last_name}</p>
                          <p><strong>Section:</strong> {user.section_name}</p>
                          <p><strong>Time:</strong>{user.day} | {formatTime(user.time_start)} - {formatTime(user.time_end)}</p>
                        </div>
                      </div>
                    );
                    })
                  )}
                  </div>
                  <div className={`${roomSearch.scheduleContainer} ${showCalendar && isMobile ? 'd-block' : 'd-none'}`}>
                  <FullCalendar {...calendarConfig} />
                  </div>
                  <div className={`${roomSearch.scheduleContainer} ${!showCalendar && !isMobile ? 'd-block' : 'd-none'}`}>
                  <FullCalendar {...calendarConfig} />
                  </div>
                </div>
                {showModal && modalData && (
                  <div className="modal fade show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
                  <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{modalData.title}</h5>
                      <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                    </div>
                    <div className="modal-body">
                      <p><strong>Course Description:</strong> {modalData.description}</p>
                      <p><strong>Instructor:</strong> {modalData.professor}</p>
                      <p><strong>Section:</strong> {modalData.section_name}</p>
                      <p><strong>Start Time:</strong> {modalData.start}</p>
                      <p><strong>End Time:</strong> {modalData.end}</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                    </div>
                  </div>
                  </div>
                )}

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
