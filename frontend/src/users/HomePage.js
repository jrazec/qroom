import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './HomePage.css';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const cards = [
    <a href="/calculator" className="room-card" key={1}>
      <i className="fa fa-calculator fa-3x"></i>
    </a>,
    <a href="/calendar" className="room-card" key={2}>
      <i className="fa fa-calendar fa-3x"></i>
    </a>,
    <a href="/messages" className="room-card" key={3}>
      <i className="fa fa-envelope fa-3x"></i>
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
    <div className="app">
      <Navbar />
      <main className="main-content">
        <h1 className="brand-title">QRoom</h1>

        <div className="carousel">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${cards.length * 100}%`
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="carousel-slide"
                style={{ width: `${100 / cards.length}%` }}
              >
                {card}
              </div>
            ))}
          </div>
        </div>

        <div className="pagination">
          {cards.map((_, index) => (
            <span
              key={index}
              className={`pagination-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>

        <div className="social-icons">
          <a href="#" className="social-icon">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className="social-icon">
          <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
