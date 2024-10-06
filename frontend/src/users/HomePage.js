import React, { useState, useEffect } from 'react';
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

  // Handle resizing to adjust the layout
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth <= 768;
      if (isMobileView !== isMobile) {
        setCurrentSlide(0); // Reset to first slide on view switch
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
      <header className="header">
        <div className="logo">QRoom</div>
        <nav className="nav">
          <a href="/" className="nav-item active">Home</a>
          <a href="/schedule" className="nav-item">Schedule</a>
          <a href="/rooms" className="nav-item">Rooms</a>
          <a href="/feedback" className="nav-item">Feedback</a>
        </nav>
      </header>

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

      <main className="main-content">
        <h1 className="brand-title">QRoom</h1>

        <div className="carousel">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${currentSlide * (isMobile ? 100 : 33.33)}%)`,
              width: `${cards.length * (isMobile ? 100 : 33.33)}%`
            }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="carousel-slide"
                style={{ width: `${isMobile ? 100 : 33.33}%` }}
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
      </main>

      <nav className="bottom-nav">
        <a href="#"><i className="fa fa-home"></i></a>
        <a href="#"><i className="fa fa-search"></i></a>
        <a href="#"><i className="fa fa-calendar"></i></a>
        <a href="#"><i className="fa fa-envelope"></i></a>
      </nav>
    </div>
  );
}

export default HomePage;
