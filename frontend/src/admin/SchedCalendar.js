import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './SchedCalendar.module.css';
import { useNavigate} from 'react-router-dom';

const WeeklySchedule = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    const handleDateSelect = (selectInfo) => {
        const title = prompt('Enter Event Title');
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

    const handleProceedClick = () => {
        alert('Proceeding to the next step')
        console.log('Proceed clicked.',);
        // You can navigate to the next page here if needed
        navigate('/admin/scheduling/roomselect');
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
            <div className={styles.headerContainer}>
                <button 
                    style={{ marginRight: '10px' }} 
                    onClick={() => navigate('/admin/scheduling/sectionselect')}
                >
                    {'<--'}
                </button>
                <h2>Department and Section</h2>
            </div>
            <div className={styles.calendarContainer}>
                <FullCalendar {...calendarConfig} />
            </div>
            <div className={styles.proceedButton}> 
                <button onClick={() => handleProceedClick}>
                    Proceed
                </button>
            </div>
        </div>
    );
};

export default WeeklySchedule;
