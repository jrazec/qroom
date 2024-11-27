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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "50px", height: "50px" }}
            fill="currentColor"
            className="bi bi-calendar-event-fill"
            viewBox="0 0 16 16"
          >
            <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
          </svg>
        </a>,
        <a href={`/user/room-search/${id}`} className={HomeCss.roomCard} key={2}>
          <svg 
            xmlns="http://www.w3.org/2000/svg"  
            style={{ width: "50px", height: "50px" }}
            fill="currentColor" 
            class="bi bi-search" 
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </a>,
        <a href={`/user/dashboard/${id}`} className={HomeCss.roomCard} key={4}>
         <svg 
          xmlns="http://www.w3.org/2000/svg" 
          style={{ width: "50px", height: "50px" }}
          fill="currentColor" 
          class="bi bi-door-open-fill" 
          viewBox="0 0 16 16">
          <path d="M1.5 15a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1H13V2.5A1.5 1.5 0 0 0 11.5 1H11V.5a.5.5 0 0 0-.57-.495l-7 1A.5.5 0 0 0 3 1.5V15zM11 2h.5a.5.5 0 0 1 .5.5V15h-1zm-2.5 8c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
        </svg>
        </a>
      ]
    : [
        <a href={`/user/schedule/${id}`} className={HomeCss.roomCard} key={1}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: "50px", height: "50px" }}
            fill="currentColor"
            className="bi bi-calendar-event-fill"
            viewBox="0 0 16 16"
          >
            <path d="M4 .5a.5.5 0 0 0-1 0V1H2a2 2 0 0 0-2 2v1h16V3a2 2 0 0 0-2-2h-1V.5a.5.5 0 0 0-1 0V1H4zM16 14V5H0v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2m-3.5-7h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5" />
          </svg>
        </a>,
        <a href={`/user/room-search/${id}`} className={HomeCss.roomCard} key={2}>
          <svg 
            xmlns="http://www.w3.org/2000/svg"  
            style={{ width: "50px", height: "50px" }}
            fill="currentColor" 
            class="bi bi-search" 
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </a>,
        <a href={`/user/feedback/${id}`} className={HomeCss.roomCard} key={3}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            style={{ width: "50px", height: "50px" }}
            fill="currentColor" 
            class="bi bi-file-earmark-arrow-up-fill" 
            viewBox="0 0 16 16"
          >
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707z"/>
          </svg>
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
