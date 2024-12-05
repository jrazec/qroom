import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import roomSearch1 from './RoomSearch1.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RoomSearch1() {
  const { id, floorid } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [buildingName, setBuildingName] = useState("");
  const [floors, setFloors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Define a mapping for building IDs to building names, floor numbers, and images
  const buildingMap = {
    1: { name: "LEONOR SOLIS BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"], image: "/assets/lsb.png" },
    2: { name: "VALERIO MALABANAN BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"], image: "/assets/vmb.png" },
    3: { name: "ANDRES BONIFACIO BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"], image: "/assets/abb.png" },
    4: { name: "GREGORIO ZARA BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor"], image: "/assets/gzb.png" }
  };

  const bldgImg = "/assets/floor.png"; // Placeholder image

  const [buildingImage, setBuildingImage] = useState("");

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user_name');
    if (!token) {
      navigate('/user/login');
      return;
    }
    if (id !== loggedInUser) {
      alert("Access forbidden");
      navigate('/not-found');
      return;
    }

    // Set building name, floors, and image based on floorid
    if (buildingMap[floorid]) {
      setBuildingName(buildingMap[floorid].name);
      setFloors(buildingMap[floorid].floors);
      setBuildingImage(buildingMap[floorid].image); // Set the building image dynamically
    }

    // Fetch rooms for the specific building and floor
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_LOCALHOST}/user/rooms/floor`, {
          params: {
            building: buildingMap[floorid].name,
            floor: buildingMap[floorid].floors[0], // Initially fetch for the first floor
          }
        });
        setRooms(response.data.rooms);
        setFilteredRooms(response.data.rooms);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, [id, navigate, floorid]);

  // Handle room click to navigate to specific room page
  const handleRoomClick = (roomId) => {
    navigate(`/user/room-search/${id}/room/${roomId}`);
  };

  // Handle floor change
  const handleFloorChange = async (floor) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_LOCALHOST}/user/rooms/floor`, {
        params: {
          building: buildingName,
          floor,
        }
      });
      setRooms(response.data.rooms);
      setFilteredRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms for floor:', error);
    }
  };

  // Handle search term change with suggestions
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) =>
        room.room_name.toLowerCase().includes(value.toLowerCase()) ||
        room.room_purpose.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredRooms(filtered);
    }
    setShowSuggestions(true);
  };

  // Handle search button click
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  // Handle back button click to navigate back to RoomSearch2
  const handleBackClick = () => {
    navigate(`/user/room-search/${id}`);
  };

  return (
    <div className={roomSearch1.app}>
      <Navbar id={id} />

      <main className={roomSearch1.mainContent}>
        {/* Split Flexbox Layout */}
        <div className={roomSearch1.flexContainer}>
          {/* Left Section: Search Bar */}
          <div className={roomSearch1.leftSection}>
            {/* Back Button at the top of Search Bar */}
            <div className="mt-3">
              <button className={roomSearch1.btn} onClick={handleBackClick}>
                Back
              </button>
            </div>

            <div className={`${roomSearch1.searchBar} mb-3 text-center position-relative`}>
              <div className="d-flex justify-content-center align-items-center w-100">
                <input
                  type="text"
                  className={`form-control ${roomSearch1.searchInput} d-inline-block w-100`}
                  placeholder="Search by room name or purpose"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {/* <button
                  className={`btn btn-danger ${roomSearch1.searchBtn} d-inline-block ml-2`}
                  onClick={handleSearch}
                >
                  Search
                </button> */}
              </div>
              {showSuggestions && searchTerm.trim() !== "" && (
                <ul className={`${roomSearch1.suggestions} list-group position-absolute w-100`} style={{ top: '100%', zIndex: '1000' }}>
                  {filteredRooms.map((room) => (
                    <li
                      key={room.room_id}
                      className="list-group-item list-group-item-action"
                      onClick={() => handleRoomClick(room.room_id)}
                    >
                      {room.room_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Building Image under the search bar */}
            <div className={roomSearch1.imagePlaceholder}>
              <img
                src={buildingImage} // Dynamically load the building image based on the selected floorid
                alt="Building"
                className={roomSearch1.placeholderImage}
              />
            </div>
          </div>

          {/* Right Section: Floor Selection and Room List */}
          <div className={roomSearch1.rightSection}>
            {/* Floor Selection Section */}
            <div className="floor-images d-flex justify-content-center align-items-center">
              {floors.map((floor, index) => (
                <div key={index} className="floor-image-container" onClick={() => handleFloorChange(floor)}>
                  <img
                    src={bldgImg}
                    alt={floor}
                    className={`img-fluid rounded shadow`}
                  />
                  <h3 className="text-center ">{floor}</h3>
                </div>
              ))}
            </div>

            {/* Room List for the Selected Floor */}
            <div className="list-group mt-4">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room) => (
                  <button
                    key={room.room_id}
                    className={`list-group-item list-group-item-action text-center ${roomSearch1.roomBtn}`}
                    onClick={() => handleRoomClick(room.room_id)}
                  >
                    {room.room_name}
                  </button>
                ))
              ) : (
                <p className="text-center mt-3">No rooms available for the selected floor or matching the search criteria.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomSearch1;
