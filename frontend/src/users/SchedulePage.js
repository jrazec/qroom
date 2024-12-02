import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ScheduleCss from './SchedulePage.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule, getSchedDetailProf } from '../api/api';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

function SchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [professors, setProfessors] = useState([]);  // Store professor data
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalEventDetails, setModalEventDetails] = useState(null); // Store event details for modal

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

    // Fetch user schedule and professor details
    if (id) {
      getUserSchedule(id)
        .then(data => {
          console.log("Schedule API Response:", data);
          
          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const baseDate = new Date();
          baseDate.setDate(baseDate.getDate() - baseDate.getDay()); // Set baseDate to the current week's Sunday

          // Fetch professor details for the user
          getSchedDetailProf(id)
            .then(profData => {
              console.log("Professor Data:", profData);
              setProfessors(profData.professor);  // Store professor list

              // Prepare events
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

                // Find the corresponding professor
                const professor = profData.professor.find(p => p.section_sched_id === item.section_sched_id);
                const professorName = professor ? professor.professor_name : "Unknown Professor";

                // Get section name
                const sectionName = item.section_name || "No section name available";

                return {
                  id: `event-${index}`,
                  title: `${item.course_code} : ${item.room_name}`,
                  start: startDate.toISOString(),
                  end: endDate.toISOString(),
                  backgroundColor: '#800000',
                  borderColor: '#800000',
                  professor: professorName,  // Add professor name to the event
                  course_description: item.course_description || "No course description available", // Add course description
                  section_name: sectionName, // Add section name to the event
                };
              }).filter(event => event !== null); // Filter out any null events

              console.log("Formatted Events for FullCalendar:", formattedEvents);

              setEvents(formattedEvents);  // Set the events with professor names and course descriptions
            })
            .catch(error => console.error('Error fetching professor details:', error));
        })
        .catch(error => console.error('Error fetching schedule:', error));
    }
  }, [id, navigate]);

  const handleEventClick = (info) => {
    const event = info.event;
    const eventDetails = {
      title: event.title,
      professor: event.extendedProps.professor,
      start: event.start.toLocaleTimeString('en-PH', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Manila' // Set the time zone to Philippine Standard Time
      }),
      end: event.end.toLocaleTimeString('en-PH', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Manila' // Set the time zone to Philippine Standard Time
      }),
      description: `${event.extendedProps.course_description}`, // Include course description in modal
      section_name: `${event.extendedProps.section_name}`,  // Include section name in modal
    };

    console.log("Event Details:", eventDetails);

    setModalEventDetails(eventDetails);
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal when clicking outside or on close button
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
    eventMouseEnter: (info) => {
      info.el.style.cursor = 'pointer';
    },
  };

  return (
    <div className={ScheduleCss.app}>
      <Navbar id={id} />
      <main className={ScheduleCss.mainContent}>
        <div className={ScheduleCss.scheduleContainer}>
          <FullCalendar {...calendarConfig} />
        </div>
      </main>

      {showModal && modalEventDetails && (
        <div className={ScheduleCss.modalBackdrop} onClick={closeModal}>
          <div className={ScheduleCss.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={`btn-close ${ScheduleCss.closeButton}`} onClick={closeModal}></button>
            <h2>{modalEventDetails.title}</h2>
            <p><strong>Course Description:</strong> {modalEventDetails.description}</p> {/* Display course description */}
            <p><strong>Instructor:</strong> {modalEventDetails.professor}</p>
            <p><strong>Section:</strong> {modalEventDetails.section_name}</p> {/* Display section name */}
            <p><strong>Start Time:</strong> {modalEventDetails.start}</p>
            <p><strong>End Time:</strong> {modalEventDetails.end}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchedulePage;
