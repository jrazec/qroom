import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import styles from './SchedCalendar.module.css';
import { useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getUserSchedule } from '../api/api';

const WeeklySchedule = () => {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [showNoRoomsWarning, setShowNoRoomsWarning] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);


    const buildings = ['LEONOR SOLIS BUILDING', 'VALERIO MALABANAN BUILDING', 'GREGORIO ZARA BUILDING', 'ANDRES BONIFACIO BUILDING'];
    const [rooms,setRooms] = useState([]);

    const [roomSchedules,setRoomSchedules] = useState({});
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

    const handleBuildingChange = (e) => {
        const bldg_name = e.target.value;
        setSelectedBuilding(bldg_name);
        const filtered = rooms.filter((room) => room.bldg_name === bldg_name);
        setFilteredRooms(filtered);
        setSelectedRoom(null);
        setShowNoRoomsWarning(filtered.length === 0)
        setEvents([]);
    };
    
    const handleRoomSelect = (e) => {
        const roomId = e.target.value;
        const room = rooms.find(r => r.room_id === parseInt(roomId, 10));
        setSelectedRoom(room);

        // Clear all events when room changes
        setEvents([]);
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
                title: `(${schedule.room_name})`,
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                backgroundColor: '#800000',
                borderColor: '#800000',
                editable: false,
            };
        });
    
        // Update events state
        setEvents(prevEvents => [
            ...prevEvents.filter(event => !event.id.startsWith(`fixed-${roomId}`)),
            ...roomEvents
        ]);
    };
    
    //unsure here
    const handleConfirmClick = async () => {
        if (selectedEventId) {
            try {
                // Extract the schedule ID or other relevant details for deletion
                const scheduleId = selectedEventId.split('-')[1]; // Assuming selectedEventId format is 'fixed-roomId-index'
                
                // Send a DELETE request to the backend API
                const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/delete-schedule`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ scheduleId }), // Send schedule ID to delete
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    // Success: Remove the event from the UI
                    setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEventId));
                    setShowModal(false);
                    alert(data.message); // Show success message
                } else {
                    // Handle error if deletion fails
                    alert(data.error || 'Failed to delete the schedule');
                }
            } catch (error) {
                console.error('Error while deleting the event:', error);
                alert('An error occurred while deleting the schedule');
            }
        }
    };
    

    const handleBackClick = () => {
            //to add here is confirmation if the user wants to go back while a deletion is not confirmed
            navigate('/admin/scheduling');
    };

    const handleEventClick = (info) => {
        if (info.event.id.startsWith('fixed-')) {
            setSelectedEventId(info.event.id);
            setShowModal(true);
        } else {
            alert('This event is part of the fixed room schedule and cannot be removed.');
        }
    };

    const handleRemoveEvent = () => {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== selectedEventId));
        setShowModal(false);
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
        selectable: false, // Allow the user to select an event
        selectMirror: true,
        selectOverlap: false, // Prevent overlapping events
        editable: false, // Prevent users from dragging events
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
                <h2>Manage Schedule</h2>
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
                    onClick={handleConfirmClick}
                    disabled={events.length === 0 || !selectedRoom}
                >
                    CONFIRM
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