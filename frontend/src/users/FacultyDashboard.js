import React, { useEffect, useState } from "react";
import Navbar from "./Navbar"; // Ensure Navbar exists
import "./FacultyDashboard.css"; // Import the custom CSS
import { fetchRoomData } from "../api/api"; // Import the API function to fetch room data

function FacultyDashboard() {
  // States for dynamic data
  const [buildingName, setBuildingName] = useState("LEONOR SOLIS BUILDING"); // Default building
  const [filterDate, setFilterDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Default to today's date
  });
  const [roomData, setRoomData] = useState({
    occupiedCount: 0,
    vacantCount: 0,
    occupiedRooms: [],
    vacantRooms: [],
    scheduledVacantRooms: [],
  });
  const [loading, setLoading] = useState(false); // Track loading state
  const [error, setError] = useState(null); // Track error state

  // Fetch room data whenever filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      try {
        const data = await fetchRoomData(buildingName, filterDate);
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
  }, [buildingName, filterDate]); // Re-fetch data when buildingName or filterDate changes

  return (
    <div>
      <Navbar />
      <div className="dashboard-container mb-5 pb-5">
        {/* Header Section */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">{new Date(filterDate).toDateString()}</p>
        </div>

        {/* Filters Section */}
        <div className="aligned-layout">
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
  {[
    { name: "LEONOR SOLIS BUILDING", abbreviation: "LSB" },
    { name: "VALERIO MALABANAN BUILDING", abbreviation: "VMB" },
    { name: "ANDRES BONIFACIO BUILDING", abbreviation: "ABB" },
    { name: "GREGORIO ZARA BUILDING", abbreviation: "GZB" },
  ].map((building, index) => (
    <button
      key={index}
      className={`building-btn ${
        buildingName === building.name ? "active" : ""
      }`}
      onClick={() => {
        if (buildingName !== building.name) {
          setBuildingName(building.name); // Update building name with the full name
        }
      }}
    >
      {building.abbreviation} {/* Show the abbreviation */}
    </button>
  ))}
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
