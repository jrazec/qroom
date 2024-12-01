import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ScheduleCss from './SchedulePage.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule } from '../api/api';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function SchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
              title: `${item.course_code} : ${item.room_name}`,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              backgroundColor: '#800000',
              borderColor: '#800000',
            };
          }).filter(event => event !== null); // Filter out any null events
  
          console.log("Formatted Events for FullCalendar:", formattedEvents);
  
          setEvents(formattedEvents);
        })
        .catch(error => console.error('Error fetching schedule:', error));
    }
  }, [id, navigate]);



  const handleEventClick = (info) => {
      setSelectedEventId(info.event.id);
      setShowModal(true);
  };

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
    slotMinTime: "07:00:00",
    slotMaxTime: "19:00:00",
    allDaySlot: false,
    selectable: false,
    selectMirror: true,
    selectOverlap: false,
    editable: false,
    events: events,
    eventClick: handleEventClick,
  };

  return (
    <div className={ScheduleCss.app}>
      <Navbar id={id} />
      <main className={ScheduleCss.mainContent}>
        <div className={ScheduleCss.scheduleContainer}>
          <FullCalendar {...calendarConfig} />
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;
