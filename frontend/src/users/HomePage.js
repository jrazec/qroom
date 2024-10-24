import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import HomeCss from './HomePage.module.css';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const cards = [
    <a href="/calculator" className={HomeCss.roomCard} key={1}>
      <h2 className={HomeCss.optionLabel}>SCHED</h2>
    </a>,
    <a href="/calendar" className={HomeCss.roomCard} key={2}>
      <h2 className={HomeCss.optionLabel}>ROOM</h2>
    </a>,
    <a href="/messages" className={HomeCss.roomCard} key={3}>
      <h2 className={HomeCss.optionLabel}>FEED</h2>
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
      <Navbar />
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