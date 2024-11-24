import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate for navigation
import Navbar from './Navbar';
import axios from 'axios';
import './ChatReport.css';

// Define the buildingMap globally
const buildingMap = {
  1: { name: "LEONOR SOLIS BUILDING", floors: ["1st Floor", "2nd Floor"] },
  2: { name: "VALERIO MALABANAN BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor"] },
  3: { name: "ANDRES BONIFACIO BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"] },
  4: { name: "GREGORIO ZARA BUILDING", floors: ["1st Floor", "2nd Floor"] },
};

function ChatReport() {
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [reportText, setReportText] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const { id } = useParams(); // Extracts the ID from the URL

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const loggedInUserName = localStorage.getItem("user_name"); // Get user_name from localStorage
    
    // Compare id from the URL with the logged-in user_name from localStorage
    if (!loggedInUserName || loggedInUserName === "undefined" || loggedInUserName !== id) {
      alert("Access forbidden");
      navigate("/not-found"); // Redirect to the correct page if the user does not match
    }
  }, [id, navigate]);

  // Initialize buildings
  useEffect(() => {
    setBuildings(Object.entries(buildingMap).map(([id, { name }]) => ({ id, name })));
  }, []);

  // Fetch rooms dynamically based on selected building
  const fetchRooms = async (buildingId) => {
    const building = buildingMap[buildingId];
    if (building) {
      const buildingName = building.name;
      const floor = building.floors ? building.floors[0] : undefined; // Default to the first floor if floors exist

      try {
        const response = await axios.get('/user/rooms/floor', {
          params: {
            building: buildingName,
            floor, // Include the floor parameter if available
          },
        });

        if (response.data && response.data.rooms) {
          setRooms(response.data.rooms);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setRooms([]);
      }
    } else {
      setRooms([]);
    }
  };

  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);
    setSelectedRoom(''); // Reset room selection
    fetchRooms(buildingId);
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleReportChange = (e) => {
    setReportText(e.target.value);
  };

  const handleSubmitReport = async () => {
    if (!selectedBuilding || !selectedRoom || !reportText) {
      setFeedbackMessage('Please select a building, room, and enter a report.');
      return;
    }

    const roomDetails = rooms.find((room) => String(room.room_id) === String(selectedRoom));
    const roomName = roomDetails?.room_name || 'Unknown';

    const reportData = {
      room_name: roomName,
      room_id: selectedRoom,
      report: reportText,
      resolved: 'not yet',
    };

    try {
      await axios.post('http://localhost:3001/reports/submit', reportData);
      setFeedbackMessage('Report submitted successfully!');
      setReportText(''); // Clear the textbox.
    } catch (error) {
      console.error('Error submitting report:', error);
      setFeedbackMessage('An error occurred while submitting the report.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center">Chat Report</h1>

        {/* Back Button */}
        <div className="mb-4">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/user/feedback/${id}`)} // Navigate to FeedbackPage
          >
            Back to Feedback
          </button>
        </div>

        {/* Dropdown for Buildings */}
        <div className="mb-4">
          <select
            className="form-select"
            value={selectedBuilding}
            onChange={handleBuildingChange}
          >
            <option value="">Select Building</option>
            {buildings.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Rooms */}
        <div className="mb-4">
          <select
            className="form-select"
            value={selectedRoom}
            onChange={handleRoomChange}
            disabled={!rooms.length}
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room.room_id} value={room.room_id}>
                {room.room_name}
              </option>
            ))}
          </select>
        </div>

        {/* Textbox for Report */}
        <div className="mb-4">
          <textarea
            className="form-control"
            rows="4"
            placeholder="Enter your report"
            value={reportText}
            onChange={handleReportChange}
          ></textarea>
        </div>

        {/* Submit Report Button */}
        <div>
          <button
            onClick={handleSubmitReport}
            className="btn btn-success"
          >
            Submit Report
          </button>
        </div>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="alert alert-info mt-3">{feedbackMessage}</div>
        )}
      </div>
    </div>
  );
}

export default ChatReport;
