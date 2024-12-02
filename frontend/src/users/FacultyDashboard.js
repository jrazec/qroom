import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Navbar"; // Ensure Navbar exists
import FacultyDashboardCss from "./FacultyDashboard.module.css"; // Import the custom CSS
import { fetchRoomData } from "../api/api"; // Import the API function to fetch room data
import FeedbackCss from "./FeedbackPage.module.css"; // Import the FeedbackPage CSS

function FacultyDashboard() {
  const [selectedBuildings, setSelectedBuildings] = useState([
    { name: "LEONOR SOLIS BUILDING", abbreviation: "LSB" },
    { name: "VALERIO MALABANAN BUILDING", abbreviation: "VMB" },
    { name: "ANDRES BONIFACIO BUILDING", abbreviation: "ABB" },
    { name: "GREGORIO ZARA BUILDING", abbreviation: "GZB" },
  ]); // Array of selected buildings
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

  const roomDataRef = useRef(roomData);

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
        roomDataRef.current = data;
        setRoomData(data); // Update state with fetched data
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("Failed to load room data. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
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
    <div className={FeedbackCss.app}>
      <Navbar />
      <main className={`container text-center py-5 ${FeedbackCss.mainContent}`}>
        {/* Header Section */}
        <div className={FacultyDashboardCss.dashboardHeader}>
          <h1 className={FacultyDashboardCss.dashboardTitle}>Dashboard</h1>
          <p className={FacultyDashboardCss.dashboardSubtitle}>
            {new Date(filterDate).toDateString()} | {currentTime}
          </p>
        </div>

        {/* Filters Section */}
        <div className={FacultyDashboardCss.alignedLayout}>
          <div className={FacultyDashboardCss.filtersSection}>
            {/* Statistics Section */}
            <div className={FacultyDashboardCss.statisticsSection}>
              <div className={FacultyDashboardCss.statCard}>
                <h5 className={FacultyDashboardCss.statTitle}>Occupied Rooms</h5>
                <p className={FacultyDashboardCss.statValue}>{roomDataRef.current.occupiedCount}</p>
              </div>
              <div className={FacultyDashboardCss.statCard}>
                <h5 className={FacultyDashboardCss.statTitle}>Available Rooms</h5>
                <p className={FacultyDashboardCss.statValue}>{roomDataRef.current.vacantCount}</p>
              </div>
            </div>

            <div className={FacultyDashboardCss.buildingButtons}>
              {buildingOptions.map((building, index) => (
                <button
                  key={index}
                  className={`${FacultyDashboardCss.buildingBtn} ${
                    selectedBuildings.includes(building.name) ? FacultyDashboardCss.active : ""
                  }`}
                  onClick={() => toggleBuildingSelection(building.name)}
                  style={{
                    backgroundColor: selectedBuildings.includes(building.name) ? "maroon" : "white",
                    border: selectedBuildings.includes(building.name) ? "none" : "1px solid maroon",
                    color: selectedBuildings.includes(building.name) ? "white" : "maroon",
                  }}
                >
                  {building.abbreviation}
                </button>
              ))}
            </div>

            {/* Room Purpose Dropdown */}
            <div className={FacultyDashboardCss.dropdownContainer}>
              <select
                value={roomPurpose}
                onChange={(e) => setRoomPurpose(e.target.value)}
                className={FacultyDashboardCss.modernDropdown}
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
                    <div className={FacultyDashboardCss.roomDetails}>
            <div className={FacultyDashboardCss.roomCard}>
              <h3 className={FacultyDashboardCss.roomCardHeader}>Occupied Rooms</h3>
              <ul className={FacultyDashboardCss.roomList}>
                {roomDataRef.current.occupiedRooms.length > 0 ? (
                  roomDataRef.current.occupiedRooms.map((room) => (
                    <li key={room.room_id} className={FacultyDashboardCss.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={FacultyDashboardCss.roomListItem}>No occupied rooms</li>
                )}
              </ul>
            </div>
            <div className={FacultyDashboardCss.roomCard}>
              <h3 className={FacultyDashboardCss.roomCardHeader}>Available Rooms</h3>
              <ul className={FacultyDashboardCss.roomList}>
                {roomDataRef.current.vacantRooms.length > 0 ? (
                  roomDataRef.current.vacantRooms.map((room) => (
                    <li key={room.room_id} className={FacultyDashboardCss.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={FacultyDashboardCss.roomListItem}>No available rooms</li>
                )}
              </ul>
            </div>
            <div className={FacultyDashboardCss.roomCard}>
              <h3 className={FacultyDashboardCss.roomCardHeader}>Scheduled but Vacant Rooms</h3>
              <ul className={FacultyDashboardCss.roomList}>
                {roomDataRef.current.scheduledVacantRooms.length > 0 ? (
                  roomDataRef.current.scheduledVacantRooms.map((room) => (
                    <li key={room.room_id} className={FacultyDashboardCss.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={FacultyDashboardCss.roomListItem}>No scheduled vacant rooms</li>
                )}
              </ul>
            </div>
          </div>
        ) : error ? (
          <p className={FacultyDashboardCss.errorText}>{error}</p>
        ) : (
          <div className={FacultyDashboardCss.roomDetails}>
            <div className={FacultyDashboardCss.roomCard}>
              <h3 className={FacultyDashboardCss.roomCardHeader}>Occupied Rooms</h3>
              <ul className={FacultyDashboardCss.roomList}>
                {roomDataRef.current.occupiedRooms.length > 0 ? (
                  roomDataRef.current.occupiedRooms.map((room) => (
                    <li key={room.room_id} className={FacultyDashboardCss.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={FacultyDashboardCss.roomListItem}>No occupied rooms</li>
                )}
              </ul>
            </div>
            <div className={FacultyDashboardCss.roomCard}>
              <h3 className={FacultyDashboardCss.roomCardHeader}>Available Rooms</h3>
              <ul className={FacultyDashboardCss.roomList}>
                {roomDataRef.current.vacantRooms.length > 0 ? (
                  roomDataRef.current.vacantRooms.map((room) => (
                    <li key={room.room_id} className={FacultyDashboardCss.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={FacultyDashboardCss.roomListItem}>No available rooms</li>
                )}
              </ul>
            </div>
            <div className={FacultyDashboardCss.roomCard}>
              <h3 className={FacultyDashboardCss.roomCardHeader}>Scheduled but Vacant Rooms</h3>
              <ul className={FacultyDashboardCss.roomList}>
                {roomDataRef.current.scheduledVacantRooms.length > 0 ? (
                  roomDataRef.current.scheduledVacantRooms.map((room) => (
                    <li key={room.room_id} className={FacultyDashboardCss.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={FacultyDashboardCss.roomListItem}>No scheduled vacant rooms</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default FacultyDashboard;
