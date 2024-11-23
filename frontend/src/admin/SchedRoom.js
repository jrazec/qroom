import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './SchedRoom.module.css';

const RoomSelect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedDepartment, selectedSection, events } = location.state || {};

  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showNoRoomsWarning, setShowNoRoomsWarning] = useState(false);

  const buildings = ['LSB', 'VMB', 'GZB', 'ABB'];
  const rooms = [
    { room_name: 'room001', building: 'LSB' },
    { room_name: 'room002', building: 'VMB' },
    { room_name: 'room003', building: 'GZB' },
    { room_name: 'room004', building: 'ABB' },
    { room_name: 'room005', building: 'LSB' },
    { room_name: 'room006', building: 'VMB' },
    { room_name: 'room007', building: 'GZB' },
    { room_name: 'room008', building: 'ABB' },
  ];

  useEffect(() => {
    if (!selectedDepartment || !selectedSection || !events) {
      alert('Schedule information is incomplete. Please go back and fill in the necessary details.');
      navigate('/admin/scheduling/sectionselect');
    }
  }, [selectedDepartment, selectedSection, events, navigate]);

  const handleBuildingChange = (e) => {
    const building = e.target.value;
    setSelectedBuilding(building);
    const filtered = rooms.filter((room) => room.building === building);
    setFilteredRooms(filtered);
    setSelectedRoom(null);
    setShowNoRoomsWarning(filtered.length === 0);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(selectedRoom?.room_name === room.room_name ? null : room);
  };

  const handleProceed = () => {
    if (!selectedRoom) {
      alert('Please choose a room before proceeding.');
      return;
    }

    const scheduleDetails = {
      department: selectedDepartment,
      section: selectedSection,
      events,
      room: selectedRoom.room_name,
      building: selectedBuilding,
    };

    const eventDetails = events.map(event => {
      const dayName = new Date(event.start).toLocaleString('en-us', { weekday: 'long' });
      return `Day: ${dayName}, Start Time: ${new Date(event.start).toLocaleTimeString()}, End Time: ${new Date(event.end).toLocaleTimeString()}`;
    }).join('\n');

    alert(
      `Selected Room Details:\nBuilding: ${scheduleDetails.building}\nRoom: ${scheduleDetails.room}\n\n` +
      `Schedule Information:\nDepartment: ${scheduleDetails.department}\nSection: ${scheduleDetails.section}\n\n` +
      `Events:\n${eventDetails}`
    );

    navigate('/admin/scheduling/summary', { state: { scheduleDetails } });
  };

  return (
    <div className={`container ${styles.assignProfessorContainer}`}>
      <div className={`mt-4 ${styles.departmentSelect}`}>
        <label htmlFor="buildingSelect" className={`form-label ${styles.label}`}>
          Select Building
        </label>
        <select
          id="buildingSelect"
          className={`form-select ${styles.departmentDropdown}`}
          value={selectedBuilding}
          onChange={handleBuildingChange}
        >
          <option value="" disabled>Choose Building</option>
          {buildings.map(building => (
            <option key={building} value={building}>{building}</option>
          ))}
        </select>
      </div>

      <div className={`mt-4 ${styles.assignProfessor}`}>
        <h3 className={styles.sectionHeader}>Select Room</h3>
        {showNoRoomsWarning ? (
          <div className={`alert alert-warning ${styles.noProfessorsWarning}`}>
            No rooms available in this building. Please choose another building.
          </div>
        ) : (
          <div className={styles.professorList}>
            {filteredRooms.map(room => (
              <div
                key={room.room_name}
                onClick={() => handleRoomSelect(room)}
                className={`${styles.professorRow} ${selectedRoom?.room_name === room.room_name ? styles.selectedRow : ''}`}
              >
                <div className={`${styles.professorCell} ${styles.professorId}`} style={{ width: '30%' }}>
                  {room.room_name}
                </div>
                <div className={`${styles.professorCell} ${styles.professorName}`} style={{ width: '35%' }}>
                  {room.building}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end">
        <Button
          variant="danger"
          className={`mt-4 ${styles.proceedButton}`}
          onClick={handleProceed}
        >
          PROCEED
        </Button>
      </div>
    </div>
  );
};

export default RoomSelect;
