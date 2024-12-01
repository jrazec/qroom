import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './RoomSearch.css';  // Import the CSS file
import { getRoom } from '../api/api';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule } from '../api/api';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
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
  const [loading, setLoading] = useState(true);

  const dayMap = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; // Map days to their index positions
  const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const { roomid, id } = useParams();
  const navigate = useNavigate();

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
      setLoading(true); // Set loading state to true while data is being fetched
  
      // Fetch room data, user schedule, and room status
      fetchData(roomid, getRoom, setSchedule, setUserDetails, getUserSchedule, setUserRole, id)
        .then(() => {
          // Fetch the room-specific data and instructors after the main room data is fetched
          getRoomSpecific(roomid)
            .then(instructors => {
              setUserDetails(instructors); // Update userDetails with fetched instructors
              setLoading(false); // Stop loading when all data is ready
            })
            .catch(error => {
              console.error("Error fetching room-specific details:", error);
              setLoading(false); // Stop loading even if there's an error
            });
  
          // Fetch room status (this could be outside the `getRoomSpecific` callback to ensure independent fetching)
          fetch(`${process.env.REACT_APP_LOCALHOST}/user/check-room?roomid=${roomid}&user_name=${id}`)
            .then(response => response.json())
            .then(data => {
              setRoomStatus(data.status ? 'Occupied' : 'Vacant');
            })
            .catch(error => {
              console.error('Error fetching room status:', error);
              setRoomStatus('Error fetching status');
            });
        })
        .catch(error => {
          console.error("Error fetching data:", error);
          setLoading(false); // Stop loading in case of error in fetching data
        });
    }
  }, [roomid, id, navigate]);
  

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
        // User can occupy and unoccupy their room
        userSchedule = 'scheduled';
      } else if (
        currentSchedule.find(
          (item) =>
            item.day === currentDay &&
            item.time_start <= currentHour &&
            item.time_end >= currentHour
        )
      ) {
        // User can reserve and unreserve their room with a waiting status
        userSchedule = 'waiting';
      } else {
        // User can occupy and unoccupy the room
        userSchedule = 'none';
      }
      console.log(userSchedule);
  
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
        // userSchedule === 'none'
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

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentDay = days[currentTime.getDay()];
      const currentHour = `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`;
  
      // Declare userSchedule before logging it
      const userSchedule = currentSchedule.find(
        (item) => item.day === currentDay && item.time_start <= currentHour && item.time_end >= currentHour
      );
  
      console.log(userSchedule, "      console.log(userSchedule)");
  
      if (userSchedule) {
        if (roomOccupied) {
          setRoomOccupied(false);
          setRoomStatus('Scheduled but not Occupied');
        } else {
          setRoomOccupied(true);
          setRoomStatus('Occupied');
        }
      } else {
        setReservationStatus('Waiting');
        setRoomStatus('Vacant');
      }
    }, 60000); // Check every minute
  
    return () => clearInterval(interval);
  }, [schedule, roomOccupied]);

  // Convert schedule to FullCalendar event format
  const calendarEvents = schedule.map((item, index) => {
    const dayOfWeek = item.day;  // e.g., 'Mon', 'Tue', etc.
    const timeStart = item.time_start;  // e.g., '14.00' (incorrect format)
    const timeEnd = item.time_end;  // e.g., '16.00' (incorrect format)
    
    // Get the current date for the year and month
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();  // Get current month (0-indexed)
    
    // Map the day of the week (e.g., 'Mon') to its date
    const dayOfWeekMap = {
      'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6
    };
    
    const dayOfMonth = new Date(year, month, dayOfWeekMap[dayOfWeek]);
    
    // Add the time to create a valid date object
    const startDateTime = new Date(`${dayOfMonth.toDateString()} ${timeStart.replace('.', ':')}`);
    const endDateTime = new Date(`${dayOfMonth.toDateString()} ${timeEnd.replace('.', ':')}`);
    
    // Ensure startDateTime and endDateTime are valid
    if (isNaN(startDateTime) || isNaN(endDateTime)) {
      console.error(`Invalid date or time: ${timeStart} - ${timeEnd} on ${dayOfWeek}`);
      return null;  // Skip invalid events
    }
  
    // Log the events being generated for FullCalendar
    console.log(`Event for ${dayOfWeek} (${timeStart} - ${timeEnd}):`, {
      start: startDateTime,
      end: endDateTime,
    });
  
    return {
      id: `event-${index}`,
      title: `${item.course_code} : ${item.section_name}`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      backgroundColor: 'blue',
      borderColor: 'blue',
    };
  }).filter(event => event !== null);  // Filter out invalid events
  
  console.log('Calendar Events:', calendarEvents); // Log all events being passed to FullCalendar
  
  
  return (
    <div className="container-fluid">
  <Navbar id={id} />
  <main> {/* Ensure enough padding below the navbar to prevent overlap */}
    <div className="mb-3">
      <button className="btn btn-link">
        <i className="fa fa-arrow-left"></i> Back
      </button>
    </div>

    <div className="row justify-content-center">
      {/* Left Section - Room Image and Status */}
      <div className="col-lg-3 col-md-4 text-center">
        <div className="room-status">
          {/* Hide image on mobile */}
          <img
            src="https://picsum.photos/500/500"
            alt="Room Status"
            className="img-fluid room-image" // Hide on mobile
          />
          <h2 className="mt-3">{userDetails[0]?.room_name}</h2>
          <p className="room-occupied">{roomStatus}</p>
          <p className="room-status-light">
            {roomStatus === 'Occupied' && <span className="text-danger">●</span>}
            {roomStatus === 'Scheduled but not Occupied' && <span className="text-warning">●</span>}
            {roomStatus === 'Vacant' && <span className="text-success">●</span>}
          </p>
          <button
            className={`btn mt-2 ${userRole.toLowerCase() === 'student' ? 'btn-secondary' : 'btn-primary'} mb-2`}
            onClick={handleToggleOccupancy}
            disabled={userRole.toLowerCase() === 'student'} // Disable button for students
          >
            {roomOccupied ? 'Unoccupy Room' : 'Occupy Room'}
          </button>
          {reservationStatus && <p className="mt-2">{reservationStatus}</p>}
        </div>
      </div>

      {/* User Details - All Instructors for the Room */}
      <div className="col-lg-3 col-md-4 text-center user-details">
        <h3>Instructors:</h3>
        <div className="card" style={{ maxHeight: '170px', overflowY: 'auto' }}>
        <div className="card-body">
          {userDetails && userDetails.length > 0 ? (
            userDetails.map((instructor, index) => (
              <div key={index} className="instructor-info mb-5 pb-5">
                <img
                  src={instructor.image}
                  alt="Instructor"
                  style={{ objectFit: 'cover' }}
                  className="img-fluid rounded-circle mb-2"
                  width="50" // Set a fixed width for images
                  height="50" // Set a fixed height for images
                />
                <p><strong>Instructor:</strong> {instructor.first_name} {instructor.middle_name} {instructor.last_name}</p>
                <p><strong>Section:</strong> {instructor.section_name}</p>
                <p><strong>Time:</strong> {instructor.time_start} - {instructor.time_end}</p>
                
                {/* Add the Day of the Week */}
                {instructor.day && (
                  <p><strong>Day:</strong> {instructor.day}</p>
                )}
              </div>
            ))
          ) : (
            <p>No instructors found for this room.</p>
          )}
        </div>

        </div>
      </div>

      {/* Right Section - FullCalendar for Schedule */}
      <div className="col-lg-6 col-md-12 mb-5">
        <div className="schedule-wrapper">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={calendarEvents}
            eventColor="#378006"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay',
            }}
          />
        </div>
      </div>
    </div>
  </main>
</div>

  );
  
  
}

export default RoomSearch;
