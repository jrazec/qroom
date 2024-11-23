import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const WeeklySchedule = () => {
    const [events, setEvents] = useState([]);

    // Handle event creation with start and end time selection
    const handleDateSelect = (selectInfo) => {
        let title = prompt('Enter Event Title');
        let calendarApi = selectInfo.view.calendar;
        calendarApi.unselect(); // Clear date selection

        if (title) {
            let newEvent = {
                id: String(events.length + 1),
                title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
            };
            setEvents([...events, newEvent]);

            // Create object with Day, Time Start, Time End
            const eventDetails = {
                day: selectInfo.startStr.split('T')[0],
                timeStart: selectInfo.startStr.split('T')[1],
                timeEnd: selectInfo.endStr.split('T')[1],
            };
            console.log('Event Details:', eventDetails); // Log the event details
        }
    };

    return (
        <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={true} // Hide header to make it look like a fixed schedule
            dayHeaders={true} // Display day names
            firstDay={1} // Set the first day to Sunday
            slotMinTime="07:00:00" // Show from 7 AM
            slotMaxTime="19:00:00" // Up to 7 PM
            allDaySlot={false} // Disable all-day events slot
            selectable={true}
            selectMirror={true}
            select={handleDateSelect} // Call when user selects time range
            events={events} // Display events on calendar
            editable={true}
            eventClick={(info) => alert(`Event: ${info.event.title}`)} // Optional: handle clicks on events
        />
    );
};

export default WeeklySchedule;