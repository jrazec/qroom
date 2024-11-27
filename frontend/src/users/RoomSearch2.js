// RoomSearch2.js
import React, { useEffect, useRef, useState } from 'react';
import Navbar from './Navbar';
import roomSearch2 from './RoomSearch2.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import axios from "axios";

function RoomSearch2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Define a mapping for building IDs to building names and floor numbers
  const buildingMap = {
    1: { name: "LEONOR SOLIS BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor"] },
    2: { name: "VALERIO MALABANAN BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"] },
    3: { name: "ANDRES BONIFACIO BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor"] },
    4: { name: "GREGORIO ZARA BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor"] }
  };
  const bldgImg = [
    "./../../assets/4.png",
    "./../../assets/3.png",
    "./../../assets/1.png",
    "./../../assets/2.png"
  ]

  useEffect(() => {
    // Authentication check
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

    // Set building information from buildingMap
    const buildings = Object.entries(buildingMap).map(([key, value]) => ({
      id: key,
      name: value.name,
      floors: value.floors
    }));
    setFilteredBuildings(buildings);
  }, [id, navigate]);

  // Handle search term change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredBuildings(Object.entries(buildingMap).map(([key, value]) => ({
        id: key,
        name: value.name,
        floors: value.floors
      })));
    } else {
      const filtered = Object.entries(buildingMap).filter(([, building]) =>
        building.name.toLowerCase().includes(value.toLowerCase())
      ).map(([key, value]) => ({
        id: key,
        name: value.name,
        floors: value.floors
      }));
      setFilteredBuildings(filtered);
    }
    setShowSuggestions(true);
  };

  // Handle building click to navigate to a specific building
  const handleBuildingClick = (building) => {
    navigate(`/user/room-search/${id}/floor/${building.id}`);
  };

  // Carousel controls
  const goToNextSlide = () => {
    if (carouselRef.current) {
      const carousel = new window.bootstrap.Carousel(carouselRef.current);
      carousel.next();
    }
  };

  const goToPreviousSlide = () => {
    if (carouselRef.current) {
      const carousel = new window.bootstrap.Carousel(carouselRef.current);
      carousel.prev();
    }
  };

  return (
    <div className={roomSearch2.app}>
      <Navbar id={id} />

      <main className={roomSearch2.mainContent}>
        {/* Search Bar */}
        <div className={`${roomSearch2.searchBar} text-center position-relative`}>
          <div className="d-flex justify-content-center align-items-center">
            <input
              type="text"
              className={`form-control ${roomSearch2.searchInput} d-inline-block`}
              placeholder="Search by building name"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button
              className={`btn btn-danger ${roomSearch2.btnSearch} d-inline-block ml-2`}
              onClick={(e) => {
                e.preventDefault();
                setShowSuggestions(false);
              }}
            >
              Search
            </button>
          </div>
          {showSuggestions && searchTerm.trim() !== "" && (
            <ul className={`${roomSearch2.suggestions} list-group position-absolute w-100`} style={{ top: '100%', zIndex: '1000' }}>
              {filteredBuildings.map((building) => (
                <li
                  key={building.id}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleBuildingClick(building)}
                >
                  {building.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Building Carousel */}
        {filteredBuildings.length > 0 && (
          <div id="carouselExampleIndicators" ref={carouselRef} className={`carousel slide mt-3 ${roomSearch2.carousel}`} data-bs-ride="carousel">
            <div id="caru" className={`carousel-inner ${roomSearch2.caru}`}>
              {filteredBuildings.map((building, index) => (
                <div
                  className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  key={building.id}
                  onClick={() => handleBuildingClick(building)}
                >
                  <img
                    src={`${bldgImg[index]}`}
                    className={`d-block w-100 ${roomSearch2.mainImage}`}
                    alt={building.name}
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="carousel-caption">
                    <h5>{building.name}</h5>
                  </div>
                </div>
              ))}
            </div>
            {/* Custom controls linked to the carousel */}
            <div className={`custom-controls mt-4 ${roomSearch2.customControls}`}>
              <button className={`btn ${roomSearch2.customBtn}`} onClick={goToPreviousSlide}><i class="fa-solid fa-play fa-flip-horizontal"></i></button>
              <button className={`btn ${roomSearch2.customBtn}`} onClick={goToNextSlide}><i class="fa-solid fa-play"></i></button>
            </div>
          </div>
        )}

        {/* Conditional rendering to hide message when filteredBuildings has results or during active search */}
        {filteredBuildings.length === 0 && searchTerm.trim() !== "" && (
          <p className="text-center mt-5">No buildings available or matching the search criteria.</p>
        )}

        {/* <h3 className={`carousel-title mt-5 ${roomSearch2.carouselTitle}`}>Buildings Available</h3> */}

      </main>
    </div>
  );
}

export default RoomSearch2;
