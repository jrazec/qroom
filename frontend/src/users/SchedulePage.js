import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Navbar from './Navbar';
import './SchedulePageStyles.css';  // Importing the new CSS file
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule } from '../api/api';

function SchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user_name');
  
    if (!token) {
      navigate('/user/login');
      return;
    }
  
    if (id !== loggedInUser) {
      alert("Access forbidden");
      navigate("/not-found");
      return;
    }
  
    if (id) {
      getUserSchedule(id)
        .then(data => {
          console.log("API Response:", data);
  
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() - baseDate.getDay()); // Set baseDate to the current week's Sunday
  
          const formattedEvents = data.result.map((item, index) => {
            const dayIndex = daysOfWeek.indexOf(item.day);
            if (dayIndex === -1) {
              console.error(`Invalid day: ${item.day}`);
              return null;
            }
  
            const eventDate = new Date(baseDate);
            eventDate.setDate(baseDate.getDate() + dayIndex); // Calculate the full date for the event day
  
            // Convert time_start and time_end to full date-time strings
            const [startHour, startMinute, startSecond] = item.time_start.split(':').map(Number);
            const [endHour, endMinute, endSecond] = item.time_end.split(':').map(Number);
  
            const startDate = new Date(eventDate);
            startDate.setHours(startHour, startMinute, startSecond || 0);
  
            const endDate = new Date(eventDate);
            endDate.setHours(endHour, endMinute, endSecond || 0);
  
            return {
              id: `event-${index}`,
              title: `${item.course_code}: ${item.room_name}`,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              backgroundColor: 'blue',
              borderColor: 'blue',
            };
          }).filter(event => event !== null); // Filter out any null events
  
          console.log("Formatted Events for FullCalendar:", formattedEvents);
  
          setEvents(formattedEvents);
        })
        .catch(error => console.error('Error fetching schedule:', error));
    }
  }, [id, navigate]);
  

  const calendarConfig = {
    plugins: [timeGridPlugin, interactionPlugin],
    initialView: window.innerWidth <= 768 ? 'timeGridDay' : 'timeGridWeek', // Switch to daily view for mobile
    headerToolbar: {
        left: 'prev,next',
        center: 'title',
        right: window.innerWidth <= 768 ? '' : 'timeGridWeek,timeGridDay',
    },
    slotMinTime: "06:00:00",
    slotMaxTime: "21:00:00",
    events,
    editable: false,
    selectable: true,
    height: "auto", // Adjust height to fit the screen
};

  return (
    <div className="app">
      <Navbar id={id} />
      <main className="mainContent mt-4">
        <div className="scheduleContainer">
          <FullCalendar {...calendarConfig} />
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;
