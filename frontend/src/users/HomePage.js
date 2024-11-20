import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HomeCss from './HomePage.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule } from '../api/api';
import { fetchData } from './sched-bar/schedBarModules';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { id } = useParams(); // This should retrieve the id from the URL
  const [role, setRole] = useState('instructor'); // Change this to 'instructor' for testing
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by looking for a token in localStorage
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
      navigate("/not-found");
      return;
    }

    if (id) { // Ensure roomid is defined before fetching
      fetchData(false, false, false, false, getUserSchedule, setRole, id);
    }
  }, [id, navigate]);

  // Debugging: Log the id and role
  console.log('User ID:', id);
  console.log('User Role:', role);

  // Conditionally render cards based on user role
  const cards = role === 'instructor'
    ? [
        <a href={`/user/schedule/${id}`} className={HomeCss.roomCard} key={1}>
          <h2 className={HomeCss.optionLabel}>SCHEDULE</h2>
        </a>,
        <a href={`/user/room-search/${id}`} className={HomeCss.roomCard} key={2}>
          <h2 className={HomeCss.optionLabel}>SEARCH</h2>
        </a>,
        <a href={`/user/dashboard/${id}`} className={HomeCss.roomCard} key={4}>
          <h2 className={HomeCss.optionLabel}>ROOMS</h2>
        </a>
      ]
    : [
        <a href={`/user/schedule/${id}`} className={HomeCss.roomCard} key={1}>
          <h2 className={HomeCss.optionLabel}>SCHEDULE</h2>
        </a>,
        <a href={`/user/room-search/${id}`} className={HomeCss.roomCard} key={2}>
          <h2 className={HomeCss.optionLabel}>SEARCH</h2>
        </a>,
        <a href={`/user/feedback/${id}`} className={HomeCss.roomCard} key={3}>
          <h2 className={HomeCss.optionLabel}>REPORT</h2>
        </a>
      ];

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      if (isMobileView !== isMobile) {
        setCurrentSlide(0);
        setIsMobile(isMobileView);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={HomeCss.app}>
      <Navbar id={id} /> {/* Pass id to Navbar */}
      <main className={HomeCss.mainContent}>
        <h1 className={HomeCss.brandTitle}>QRoom</h1>

        <div className={HomeCss.socialIcons}>
          <a href="#" className={HomeCss.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={HomeCss.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={HomeCss.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>

        <div className={HomeCss.carousel}>
          <div
            className={HomeCss.carouselTrack}
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${cards.length * 100}%`
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className={HomeCss.carouselSlide}
                style={{ width: `${100 / cards.length}%` }}
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        <div className={HomeCss.pagination}>
          {cards.map((_, index) => (
            <span
              key={index}
              className={`${HomeCss.paginationDot} ${currentSlide === index ? HomeCss.active : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </main>
    </div>
  );
}

export default HomePage;
