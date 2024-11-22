import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Scheduling.css";
import { cur } from "../App";

function Scheduling() {
    const [bldgNames, setBldgNames] = useState([]); // To store unique building names
    const [selectedBldg, setSelectedBldg] = useState(""); // Selected building
    const [day, setDay] = useState("Monday"); // Default day
    const [timeStart, setTimeStart] = useState("07:00"); // Default start time
    const [timeEnd, setTimeEnd] = useState("10:00"); // Default end time
    const [availableRooms, setAvailableRooms] = useState([]); // Rooms fetched from the backend
    const [filteredRooms, setFilteredRooms] = useState([]); // Rooms filtered by building
    const [searchTerm, setSearchTerm] = useState(""); // Search term for room names

    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [roomsPerPage] = useState(5); // Number of rooms per page

    const selectRef = useRef(null);

    // Fetch buildings from the backend
    const fetchBuildings = async () => {
        try {
            const response = await fetch(`/api/buildings`); // Replace with your backend route
            const data = await response.json();

            // Get unique building names
            const uniqueBuildings = [...new Set(data.map((building) => building.bldg_name))];
            setBldgNames(uniqueBuildings);
        } catch (error) {
            console.error("Error fetching buildings:", error);
        }
    };

    // Fetch available rooms from the backend
    const fetchAvailableRooms = async () => {
        try {
            const response = await fetch(`/api/scheduling/available-rooms?day=${day}&time_start=${timeStart}&time_end=${timeEnd}`);
            const data = await response.json();
            setAvailableRooms(data);
            setFilteredRooms(data); // Initialize with all available rooms
        } catch (error) {
            console.error("Error fetching available rooms:", error);
        }
    };

    // Filter rooms by selected building
    useEffect(() => {
        if (selectedBldg) {
            const filtered = availableRooms.filter((room) => room.bldg_name === selectedBldg);
            setFilteredRooms(filtered);
        } else {
            setFilteredRooms(availableRooms); // Show all if no building is selected
        }
    }, [selectedBldg, availableRooms]);

    // Fetch data when the component loads
    useEffect(() => {
        fetchBuildings(); // Fetch building names
        fetchAvailableRooms(); // Fetch available rooms
    }, [day, timeStart, timeEnd]);

    // Handle building selection
    const handleBuildingChange = (e) => {
        const building = e.target.value;
        cur.dept = building;
        setSelectedBldg(building);
        setCurrentPage(1); // Reset pagination to first page
    };

    // Handle search functionality
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);

        const filtered = availableRooms.filter((room) =>
            room.room_name.toLowerCase().includes(term) &&
            (!selectedBldg || room.bldg_name === selectedBldg)
        );
        setFilteredRooms(filtered);
        setCurrentPage(1); // Reset pagination to first page
    };

    // Pagination logic
    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Generate dynamic pagination
    const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);
    const maxPageLinks = 5; // Maximum number of pagination links to show
    const startPage = Math.max(currentPage - Math.floor(maxPageLinks / 2), 1);
    const endPage = Math.min(startPage + maxPageLinks - 1, totalPages);

    return (
        <>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">
                        Dashboard <span className="sub-title">Scheduling</span>
                    </h1>
                </div>

                <div className="department-room-assignment">
                    <h2>Building Room Assignment</h2>
                    <div>
                        <label htmlFor="bldg" className="font-weight-bold mr-2">
                            {(selectedBldg === "") ? "Choose Building" : selectedBldg}
                        </label>
                        <select
                            id="bldg"
                            className="form-control d-inline-block w-auto mr-3"
                            name="bldgSelection"
                            ref={selectRef}
                            onChange={handleBuildingChange}
                        >
                            <option value="">Choose here.</option>
                            {bldgNames.map((bldg, index) => (
                                <option key={index} value={bldg}>
                                    {bldg}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="day" className="mr-2">Day:</label>
                        <select
                            id="day"
                            className="form-control d-inline-block w-auto mr-3"
                            onChange={(e) => setDay(e.target.value)}
                        >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>

                        <label htmlFor="timeStart" className="mr-2">Start Time:</label>
                        <input
                            type="time"
                            id="timeStart"
                            className="form-control d-inline-block w-auto mr-3"
                            value={timeStart}
                            onChange={(e) => setTimeStart(e.target.value)}
                        />

                        <label htmlFor="timeEnd" className="mr-2">End Time:</label>
                        <input
                            type="time"
                            id="timeEnd"
                            className="form-control d-inline-block w-auto"
                            value={timeEnd}
                            onChange={(e) => setTimeEnd(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="search" className="mr-2">Search Rooms:</label>
                        <input
                            type="text"
                            id="search"
                            className="form-control d-inline-block w-auto mr-3"
                            placeholder="Search by name..."
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="room-assignment-grid">
                        {currentRooms.length > 0 ? (
                            currentRooms.map((room) => (
                                <div key={room.room_id} className="room-column">
                                    {room.room_name}
                                </div>
                            ))
                        ) : (
                            <div>No available rooms for the selected building or time.</div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                            <button
                                key={page}
                                className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                                onClick={() => paginate(page)}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            className="pagination-btn"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </div>

                <div className="circle-buttons">
                    <Link to="/admin/scheduling/sections" className="text-white">
                        <button className="circle-btn">Manage Sections</button>
                    </Link>
                    <Link to="/admin/scheduling/courses" className="text-white">
                        <button className="circle-btn">Manage Course</button>
                    </Link>
                    <Link to="/admin/scheduling/class" className="text-white">
                        <button className="circle-btn">Schedule Class</button>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default Scheduling;
