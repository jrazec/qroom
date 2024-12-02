import React, { useEffect, useState, useRef } from "react";
import styles from "./AdminFDashboard.module.css"; // Import the custom CSS
import { fetchRoomData, getInstructorCount, getStudentCount } from "../api/api"; // Import the API function to fetch room data

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

  const [totalInstructors, setTotalInstructors] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const instructorCount = await getInstructorCount();
        const studentCount = await getStudentCount();
        setTotalInstructors(instructorCount);  // No need to access object properties here anymore
        setTotalStudents(studentCount);        // No need to access object properties here anymore
        console.log("Instructor Count:", instructorCount);  // Log the correct count
        console.log("Student Count:", studentCount);        // Log the correct count
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, []);
  

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
    <div className={styles.app}>
      <main className={`container text-center py-5 ${styles.mainContent}`}>
        {/* Header Section */}
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>Dashboard</h1>
          <p className={styles.dashboardSubtitle}>
            {new Date(filterDate).toDateString()} | {currentTime}
          </p>
        </div>

        {/* Filters Section */}
        <div className={styles.alignedLayout}>
          <div className={styles.filtersSection}>
            {/* Statistics Section */}
            <div className={styles.statisticsSection}>
              <div className={styles.statCard}>
                <h5 className={styles.statTitle}>Occupied Rooms</h5>
                <p className={styles.statValue}>{roomDataRef.current.occupiedCount}</p>
              </div>
              <div className={styles.statCard}>
                <h5 className={styles.statTitle}>Available Rooms</h5>
                <p className={styles.statValue}>{roomDataRef.current.vacantCount}</p>
              </div>
            </div>

            <div className={styles.buildingButtons}>
              {buildingOptions.map((building, index) => (
                <button
                  key={index}
                  className={`${styles.buildingBtn} ${
                    selectedBuildings.includes(building.name) ? styles.active : ""
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
            <div className={styles.dropdownContainer}>
              <select
                value={roomPurpose}
                onChange={(e) => setRoomPurpose(e.target.value)}
                className={styles.modernDropdown}
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
                    <div className={styles.roomDetails}>
            <div className={styles.roomCard}>
              <h3 className={styles.roomCardHeader}>Occupied Rooms</h3>
              <ul className={styles.roomList}>
                {roomDataRef.current.occupiedRooms.length > 0 ? (
                  roomDataRef.current.occupiedRooms.map((room) => (
                    <li key={room.room_id} className={styles.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={styles.roomListItem}>No occupied rooms</li>
                )}
              </ul>
            </div>
            <div className={styles.roomCard}>
              <h3 className={styles.roomCardHeader}>Available Rooms</h3>
              <ul className={styles.roomList}>
                {roomDataRef.current.vacantRooms.length > 0 ? (
                  roomDataRef.current.vacantRooms.map((room) => (
                    <li key={room.room_id} className={styles.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={styles.roomListItem}>No available rooms</li>
                )}
              </ul>
            </div>
            <div className={styles.roomCard}>
              <h3 className={styles.roomCardHeader}>Scheduled but Vacant Rooms</h3>
              <ul className={styles.roomList}>
                {roomDataRef.current.scheduledVacantRooms.length > 0 ? (
                  roomDataRef.current.scheduledVacantRooms.map((room) => (
                    <li key={room.room_id} className={styles.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={styles.roomListItem}>No scheduled vacant rooms</li>
                )}
              </ul>
            </div>
          </div>
        ) : error ? (
          <p className={styles.errorText}>{error}</p>
        ) : (
          <div className={styles.roomDetails}>
            <div className={styles.roomCard}>
              <h3 className={styles.roomCardHeader}>Occupied Rooms</h3>
              <ul className={styles.roomList}>
                {roomDataRef.current.occupiedRooms.length > 0 ? (
                  roomDataRef.current.occupiedRooms.map((room) => (
                    <li key={room.room_id} className={styles.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={styles.roomListItem}>No occupied rooms</li>
                )}
              </ul>
            </div>
            <div className={styles.roomCard}>
              <h3 className={styles.roomCardHeader}>Available Rooms</h3>
              <ul className={styles.roomList}>
                {roomDataRef.current.vacantRooms.length > 0 ? (
                  roomDataRef.current.vacantRooms.map((room) => (
                    <li key={room.room_id} className={styles.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={styles.roomListItem}>No available rooms</li>
                )}
              </ul>
            </div>
            <div className={styles.roomCard}>
              <h3 className={styles.roomCardHeader}>Scheduled but Vacant Rooms</h3>
              <ul className={styles.roomList}>
                {roomDataRef.current.scheduledVacantRooms.length > 0 ? (
                  roomDataRef.current.scheduledVacantRooms.map((room) => (
                    <li key={room.room_id} className={styles.roomListItem}>
                      {room.room_name}
                    </li>
                  ))
                ) : (
                  <li className={styles.roomListItem}>No scheduled vacant rooms</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* total part */}
        <div>
          <div className={styles.summaryContainer}>
              <div className={styles.statCardTotal}>
                <div>
                  <h4 className={styles.statTitle}>Total Instructors</h4>
                  <h2 className={styles.statValue}>{totalInstructors}</h2>
                </div>
              </div>
              <div className={styles.statCardTotal}>
                <div>  
                  <h4 className={styles.statTitle}>Total Students</h4>
                  <h2 className={styles.statValue}>{totalStudents}</h2>
                </div>
              </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default FacultyDashboard;
