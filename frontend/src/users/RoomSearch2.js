import React, { useEffect, useRef } from 'react';
import Navbar from './Navbar';
import roomSearch2 from './RoomSearch2.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function RoomSearch2() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const carouselRef = useRef(null);

  // Check for authentication
  useEffect(() => {
    // Check if the user is authenticated by looking for a token in localStorage
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user_name'); // Get logged-in user's username from localStorage

    if (!token) {
      // If no token, redirect to login page
      navigate('/user/login');
      return;
    }

    // If the user is trying to access another user's page
    if (id !== loggedInUser) {
      alert("Access forbidden");
      navigate('/not-found'); // Redirect to the homepage or NotFound page
      return;
    }
  }, [id, navigate]);

  const goToNextSlide = () => {
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      const bsCarousel = new window.bootstrap.Carousel(carousel);
      bsCarousel.next();
    }
  };

  const goToPreviousSlide = () => {
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      const bsCarousel = new window.bootstrap.Carousel(carousel);
      bsCarousel.prev();
    }
  };

  return (
    <div className={roomSearch2.app}>
      <Navbar />

      <main className={roomSearch2.mainContent}>
        {/* Search Bar */}
        <div className={roomSearch2.searchBar}>
          <input type="text" className={`form-control ${roomSearch2.searchInput}`} placeholder="search" />
          <button className={`btn ${roomSearch2.btnSearch}`}>Search</button>
        </div>

        {/* Carousel */}
        <div id="carouselExampleIndicators" ref={carouselRef} className={`carousel slide mt-5 ${roomSearch2.carousel}`} data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://picsum.photos/500/300?random=1" className={`d-block w-100 ${roomSearch2.mainImage}`} alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src="https://picsum.photos/500/300?random=2" className={`d-block w-100 ${roomSearch2.mainImage}`} alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src="https://picsum.photos/500/300?random=3" className={`d-block w-100 ${roomSearch2.mainImage}`} alt="Slide 3" />
            </div>
          </div>
        </div>

        {/* Custom controls linked to the carousel */}
        <div className={`custom-controls mt-4 ${roomSearch2.customControls}`}>
          <button className={`btn ${roomSearch2.customBtn}`} onClick={goToPreviousSlide}>previous</button>
          <div className={roomSearch2.dotIndicators}>
            <span className={roomSearch2.dot}></span>
            <span className={roomSearch2.dot}></span>
            <span className={roomSearch2.dot}></span>
            <span className={roomSearch2.dot}></span>
          </div>
          <button className={`btn ${roomSearch2.customBtn}`} onClick={goToNextSlide}>next</button>
        </div>

        <h3 className={`carousel-title mt-2 ${roomSearch2.carouselTitle}`}>CECS</h3>

      </main>
    </div>
  );
}

export default RoomSearch2;
