import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './SchedCalendar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const WeeklySchedule = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract selectedDepartment and selectedSection from location.state
    const { selectedDepartment, selectedSection } = location.state || {};

    const [events, setEvents] = useState([]);
    console.log(events);

    const handleDateSelect = (selectInfo) => {
        // Automatically set the title using selectedDepartment and selectedSection
        const title = `${selectedDepartment}, ${selectedSection}`;
        const calendarApi = selectInfo.view.calendar;
        calendarApi.unselect();

        if (!title) return;

        const newEvent = {
            id: String(events.length + 1),
            title,
            start: selectInfo.startStr,
            end: selectInfo.endStr,
            allDay: selectInfo.allDay,
        };

        const eventDetails = {
            day: selectInfo.startStr.split('T')[0],
            timeStart: selectInfo.startStr.split('T')[1],
            timeEnd: selectInfo.endStr.split('T')[1],
        };

        setEvents([...events, newEvent]);
        console.log('Event Details:', eventDetails);
    };

    const getDayName = (dateString) => {
        const date = new Date(dateString);
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[date.getDay()];
    };
    
    const handleProceedClick = () => {
        if (!selectedDepartment || !selectedSection) {
            alert('Department and Section information are missing.');
            return;
        }
    
        // Extracting day name instead of specific date for a better alert message
        const eventsDetails = events.map(event => {
            const dayName = new Date(event.start).toLocaleString('en-us', { weekday: 'long' });
            return `Title: ${event.title}, Day: ${dayName}, Start Time: ${new Date(event.start).toLocaleTimeString()}, End Time: ${new Date(event.end).toLocaleTimeString()}`;
        }).join('\n');
        
        alert(`Proceed with schedule:\n${eventsDetails}`);
        console.log('Proceed clicked.');
    
        navigate('/admin/scheduling/roomselect', { state: { selectedDepartment, selectedSection, events } });
    };

    const handleBackClick = () => {
        if (events.length > 0) {
            if (window.confirm('You have already created events. Are you sure you want to go back?')) {
                navigate('/admin/scheduling/sectionselect');
            }
        } else {
            navigate('/admin/scheduling/sectionselect');
        }
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
        firstDay: 1,
        slotMinTime: "07:00:00",
        slotMaxTime: "19:00:00",
        allDaySlot: false,
        selectable: true,
        selectMirror: true,
        selectOverlap: () => true,
        selectAllow: () => true,
        selectConstraint: null,
        eventBackgroundColor: "#800000",
        eventBorderColor: "#800000",
        select: handleDateSelect,
        events: events,
        editable: true,
        eventClick: (info) => alert(`Event: ${info.event.title}`),
    };

    return (
        <div className={styles.calendarWrapper}>
            <div className={`${styles.headerContainer} d-flex align-items-center mb-3`}>
                <span 
                    className={`${styles.backIcon} me-3`} 
                    onClick={handleBackClick}
                    style={{
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        color: '#800000',
                    }}
                >
                    &larr;
                </span>
                <h2>Department: {selectedDepartment}, Section: {selectedSection}</h2>
            </div>
            <div className={styles.calendarContainer}>
                <FullCalendar {...calendarConfig} />
            </div>
            <Button 
                variant="primary" 
                className={`${styles.proceedButton} mt-4 d-block mx-auto`} 
                onClick={handleProceedClick}
                disabled={events.length === 0}
            >
                PROCEED
            </Button>
        </div>
    );
};

export default WeeklySchedule;
