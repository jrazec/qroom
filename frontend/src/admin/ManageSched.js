import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './SchedCalendar.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserSchedule } from '../api/api';

const WeeklySchedule = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract "selectedDepartment" and "selectedSection" from location.state
    // const { "selectedDepartment", "selectedSection",userSectionSched } = location.state || {};

    const [events, setEvents] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showNoRoomsWarning, setShowNoRoomsWarning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isEventSelected, setIsEventSelected] = useState(false);


    const buildings = ['LEONOR SOLIS BUILDING', 'VALERIO MALABANAN BUILDING', 'GREGORIO ZARA BUILDING', 'ANDRES BONIFACIO BUILDING'];
    const [rooms,setRooms] = useState([
        { room_name: 'room001', building: 'LSB' },
        { room_name: 'room002', building: 'VMB' },
        { room_name: 'room003', building: 'GZB' },
        { room_name: 'room004', building: 'ABB' },
        { room_name: 'room005', building: 'LSB' },
        { room_name: 'room006', building: 'VMB' },
        { room_name: 'room007', building: 'GZB' },
        { room_name: 'room008', building: 'ABB' },
    ]);

    const [roomSchedules,setRoomSchedules] = useState({
        room001: [
            { start: '2024-11-27T08:00:00', end: '2024-11-27T10:00:00' },
            { start: '2024-11-28T13:00:00', end: '2024-11-28T15:00:00' }
        ],
        room002: [
            { start: '2024-11-27T09:00:00', end: '2024-11-27T11:00:00' }
        ],
        // Add similar schedules for other rooms as needed
    });
    useEffect(() => {
        const fetchRoomSchedules = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/room-sched`)
                const data = await response.json();
                setRooms(data.room.results);
                const newRoomSchedules = data.sched.results.reduce((acc, curr) => {
                    const { room_id, day, time_start, time_end, room_name, bldg_name } = curr;

                    // Create a unique key for each room
                    if (!acc[room_id]) {
                        acc[room_id] = [];
                    }

                    // Extract the start and end time for each day
                    acc[room_id].push({
                        day,
                        time_start,
                        time_end,
                        room_name,
                        bldg_name
                    });
                    console.log(acc)
                    return acc;
                }, {});
                console.log(newRoomSchedules)
                setRoomSchedules(newRoomSchedules);
            } catch (error) {
                setRooms([]); // Reset rooms on failure
                setRoomSchedules({});
                console.error('Error fetching room schedules:', error);
            }
        };

        fetchRoomSchedules();
    }, []);
    // useEffect(() => {
    //     if (!"selectedDepartment" || !"selectedSection") {
    //         alert('Schedule information is incomplete. Please go back and fill in the necessary details.');
    //         navigate('/admin/scheduling/sectionselect');
    //     }
    // }, ["selectedDepartment", "selectedSection", navigate]);

    const handleBuildingChange = (e) => {
        const bldg_name = e.target.value;
        setSelectedBuilding(bldg_name);
        const filtered = rooms.filter((room) => room.bldg_name === bldg_name);
        setFilteredRooms(filtered);
        setSelectedRoom(null);
        setShowNoRoomsWarning(filtered.length === 0)
        setEvents([]);
    };
    
    const scheduleDetails = {
        department: "selectedDepartment",
        section: "selectedSection",
        events,
        room: selectedRoom,
        bldg_name: selectedBuilding,
      };
    const handleRoomSelect = (e) => {
        const roomId = e.target.value;
        const room = rooms.find(r => r.room_id === parseInt(roomId, 10));
        setSelectedRoom(room);

        // Clear all events when room changes
        setEvents([]);
        setIsEventSelected(false);
        updateRoomSchedules(parseInt(roomId, 10));
    };

    const updateRoomSchedules = (roomId) => {
        if (!roomSchedules[roomId]) return;
    
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
        const baseDate = new Date();
        baseDate.setDate(baseDate.getDate() - baseDate.getDay()); // Set to the current week's Sunday
    
        const roomEvents = roomSchedules[roomId].map((schedule, index) => {
            const dayIndex = daysOfWeek.indexOf(schedule.day);
    
            // Calculate the target date for the event day
            const targetDate = new Date(baseDate);
            targetDate.setDate(baseDate.getDate() + dayIndex);
    
            // Convert time strings to actual Date objects
            const [startHour, startMinute] = schedule.time_start.split(':').map(Number);
            const [endHour, endMinute] = schedule.time_end.split(':').map(Number);
    
            const startDate = new Date(targetDate);
            startDate.setHours(startHour, startMinute, 0, 0);
    
            const endDate = new Date(targetDate);
            endDate.setHours(endHour, endMinute, 0, 0);
    
            return {
                id: `fixed-${roomId}-${index}`,
                title: `Room Reserved (${schedule.room_name})`,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                backgroundColor: 'gray',
                borderColor: 'gray',
                editable: false,
            };
        });
    
        // Update events state
        setEvents(prevEvents => [
            ...prevEvents.filter(event => !event.id.startsWith(`fixed-${roomId}`)),
            ...roomEvents
        ]);
    };
    

    // const handleDateSelect = (selectInfo) => {
    //     if (isEventSelected) {
    //         alert('You already have an active event. Please remove it or proceed before adding a new one.');
    //         return;
    //     }
    
    //     if (!selectedRoom) {
    //         console.log('Please select a room before adding an event.');
    //         return;
    //     }
    
    //     const title = `${"selectedDepartment"}, ${"selectedSection"}, Room: ${selectedRoom.room_name}`;
    //     const calendarApi = selectInfo.view.calendar;
    //     calendarApi.unselect();
    
    //     const newEventStart = new Date(selectInfo.startStr);
    //     const newEventEnd = new Date(selectInfo.endStr);
    
    //     // Ensure the start and end times are within the same day
    //     if (newEventStart.toDateString() !== newEventEnd.toDateString()) {
    //         alert('The selected time spans multiple days. Please select a single day.');
    //         return;
    //     }
    
    //     // Check for overlap in the same room (same day)
    //     const isOverlapWithOtherEvents = events.some(event => {
    //         if (event.extendedProps?.room === selectedRoom.room_name) {
    //             const eventStart = new Date(event.start);
    //             const eventEnd = new Date(event.end);
    
    //             // Check if the selected time overlaps with existing events on the same day
    //             return (newEventStart < eventEnd && newEventEnd > eventStart);
    //         }
    //         return false;
    //     });
    
    //     if (isOverlapWithOtherEvents) {
    //         alert('The selected time overlaps with another event for this room. Please choose another time.');
    //         return;
    //     }
    
    //     const newEvent = {
    //         id: String(events.length + 1),
    //         title,
    //         start: selectInfo.startStr,
    //         end: selectInfo.endStr,
    //         allDay: selectInfo.allDay,
    //         extendedProps: {
    //             room: selectedRoom.room_name,
    //         },
    //     };
    
    //     // Add the new event to the state
    //     setEvents(prevEvents => [...prevEvents, newEvent]);
    
    //     // Set the event as selected to prevent additional selections
    //     setIsEventSelected(true);
    // };
    
    
    

    const handleProceedClick = () => {
        // if (!"selectedDepartment" || !"selectedSection") {
        //     alert('Department and Section information are missing.');
        //     return;
        // }
    
        // if (!selectedRoom) {
        //     alert('Please select a room before proceeding.');
        //     return;
        // }
    
        // const userCreatedEvent = events.find(event => !event.id.startsWith('fixed-'));
        // if (!userCreatedEvent) {
        //     alert('No user-created event found.');
        //     return;
        // }
    

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

    const handleEventClick = (info) => {
        if (!info.event.id.startsWith('fixed-')) {
            setSelectedEventId(info.event.id);
            setShowModal(true);
        } else {
            alert('This event is part of the fixed room schedule and cannot be removed.');
        }
    };

    const handleRemoveEvent = () => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEventId));
        setShowModal(false);
        setIsEventSelected(false); // Allow new event selections after removal
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
        selectable: true, // Allow the user to select an event
        selectMirror: true,
        selectOverlap: false, // Prevent overlapping events
        editable: false, // Prevent users from dragging events
        // select: handleDateSelect, // Function to call when a date range is selected
        events: events, // Use the events with fixed schedules
        eventClick: handleEventClick,
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
                <h2>Department: {"selectedDepartment"}, Section: {"selectedSection"}</h2>
            </div>
            <div className={`mt-4 ${styles.motherCont}`}>
               <div className={styles.roomSelection}>
               <div className={`${styles.buildingSelect}`}>
                    <label htmlFor="buildingSelect" className={`form-label ${styles.label}`}>
                        Select Building
                    </label>
                    <select
                        id="buildingSelect"
                        className={`form-select ${styles.buildingDropdown}`}
                        value={selectedBuilding}
                        onChange={handleBuildingChange}
                    >
                        <option value="" disabled>Choose Building</option>
                        {buildings.map(building => (
                            <option key={building} value={building}>{building}</option>
                        ))}
                    </select>
                </div>
                <div className={`${styles.roomSelection}`}>
                    <label htmlFor="roomSelect" className={`form-label ${styles.label}`}>
                        Select Room
                    </label>
                    <select
                        id="roomSelect"
                        className={`form-select ${styles.roomDropdown}`}
                        value={selectedRoom?.room_id || ''}
                        onChange={handleRoomSelect}
                        disabled={!selectedBuilding}
                    >
                        <option value="" disabled>Choose Room</option>
                        {filteredRooms.map(room => (
                            <option key={room.room_id} value={room.room_id}>{room.room_name}</option>
                        ))}
                    </select>

                    {showNoRoomsWarning && (
                        <div className={`alert alert-warning ${styles.noRoomsWarning}`}>
                            No rooms available in this building. Please choose another building.
                        </div>
                    )}
                </div>
               </div>
                <div className={styles.calendarContainer}>
                    <FullCalendar {...calendarConfig} />
                </div>
                <Button
                    variant="primary"
                    className={`${styles.proceedButton} mt-4 d-block mx-auto`}
                    onClick={handleProceedClick}
                    disabled={events.length === 0 || !selectedRoom}
                >
                    PROCEED
                </Button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this event?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRemoveEvent}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default WeeklySchedule;