import React, { useEffect, useState } from "react";
import Navbar from "./Navbar"; // Ensure Navbar exists
import "./FacultyDashboard.css"; // Import the custom CSS
import { fetchRoomData } from "../api/api"; // Import the API function to fetch room data

function FacultyDashboard() {
  const [selectedBuildings, setSelectedBuildings] = useState([]); // Array of selected buildings
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Default to today's date
  });
  const [roomPurpose, setRoomPurpose] = useState("ALL"); // Default room purpose
  const [roomPurposes, setRoomPurposes] = useState([]); // List of available room purposes
  const [roomData, setRoomData] = useState({
    occupiedCount: 0,
    vacantCount: 0,
    occupiedRooms: [],
    vacantRooms: [],
    scheduledVacantRooms: [],
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error state
  const [currentTime, setCurrentTime] = useState(""); // Track the current time

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
      setCurrentTime(formattedTime);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch room purposes
  useEffect(() => {
    const fetchRoomPurposes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/rooms/get-room-purposes`);
        const data = await response.json();
        setRoomPurposes(data);
        setRoomPurpose("ALL"); // Default to "ALL"
      } catch (error) {
        console.error("Error fetching room purposes:", error);
      }
    };
    fetchRoomPurposes();
  }, []);

  // Fetch room data whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      if (selectedBuildings.length === 0) {
        // Reset data if no building is selected
        setRoomData({
          occupiedCount: 0,
          vacantCount: 0,
          occupiedRooms: [],
          vacantRooms: [],
          scheduledVacantRooms: [],
        });
        return;
      }

      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        const data = await fetchRoomData(
          selectedBuildings, // Pass selected buildings as an array
          filterDate,
          roomPurpose === "ALL" ? "" : roomPurpose // If "ALL", send empty purpose
        );
        console.log("Fetched Room Data:", data); // Debugging log
        setRoomData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("Failed to load room data. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchData();
  }, [selectedBuildings, filterDate, roomPurpose]); // Re-fetch data when filters change

  const toggleBuildingSelection = (building) => {
    setSelectedBuildings((prev) =>
      prev.includes(building)
        ? prev.filter((b) => b !== building) // Remove building if already selected
        : [...prev, building] // Add building if not already selected
    );
  };

  const buildingOptions = [
    { name: "LEONOR SOLIS BUILDING", abbreviation: "LSB" },
    { name: "VALERIO MALABANAN BUILDING", abbreviation: "VMB" },
    { name: "ANDRES BONIFACIO BUILDING", abbreviation: "ABB" },
    { name: "GREGORIO ZARA BUILDING", abbreviation: "GZB" },
  ];

  return (
    <div>
      <Navbar />
      <div className="dashboard-container mb-5 pb-5">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            {new Date(filterDate).toDateString()} | {currentTime}
          </p>
        </div>

        {/* Filters Section */}
        <div className="aligned-layout">
          <div className="filters-section">
            {/* Statistics Section */}
            <div className="statistics-section">
              <div className="stat-card">
                <h5 className="stat-title">Occupied Rooms</h5>
                <p className="stat-value">{roomData.occupiedCount}</p>
              </div>
              <div className="stat-card">
                <h5 className="stat-title">Available Rooms</h5>
                <p className="stat-value">{roomData.vacantCount}</p>
              </div>
            </div>

            {/* Building Buttons */}
            <div className="building-buttons">
              {buildingOptions.map((building, index) => (
                <button
                  key={index}
                  className={`building-btn ${
                    selectedBuildings.includes(building.name) ? "active" : ""
                  }`}
                  onClick={() => toggleBuildingSelection(building.name)}
                >
                  {building.abbreviation}
                </button>
              ))}
            </div>

            {/* Room Purpose Dropdown */}
            <div className="dropdown-container">
              <select
                value={roomPurpose}
                onChange={(e) => setRoomPurpose(e.target.value)}
                className="modern-dropdown"
              >
                <option value="ALL">ALL</option>
                {roomPurposes.map((purpose, index) => (
                  <option key={index} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading, Error, and Room Details Section */}
        {loading ? (
          <p className="loading-text">Loading room data...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div className="room-details">
            <div className="room-card">
              <h3 className="room-card-header">Occupied Rooms</h3>
              <ul className="room-list">
                {roomData.occupiedRooms.length > 0 ? (
                  roomData.occupiedRooms.map((room) => (
                    <li key={room.room_id} className="room-list-item">
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className="room-list-item">No occupied rooms</li>
                )}
              </ul>
            </div>
            <div className="room-card">
              <h3 className="room-card-header">Available Rooms</h3>
              <ul className="room-list">
                {roomData.vacantRooms.length > 0 ? (
                  roomData.vacantRooms.map((room) => (
                    <li key={room.room_id} className="room-list-item">
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className="room-list-item">No available rooms</li>
                )}
              </ul>
            </div>
            <div className="room-card">
              <h3 className="room-card-header">Scheduled but Vacant Rooms</h3>
              <ul className="room-list">
                {roomData.scheduledVacantRooms.length > 0 ? (
                  roomData.scheduledVacantRooms.map((room) => (
                    <li key={room.room_id} className="room-list-item">
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className="room-list-item">No scheduled vacant rooms</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;
