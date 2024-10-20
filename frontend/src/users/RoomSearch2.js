import React, { useRef } from 'react';
import Navbar from './Navbar';
import styles from './RoomSearch2.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function RoomSearch2() {
  const carouselRef = useRef(null);

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
    <div className={styles.app}>
      <Navbar />
      <main className={styles.mainContent}>
        {/* Search Bar */}
        <div className={styles.searchBar}>
          <input type="text" className={`form-control ${styles.searchInput}`} placeholder="search" />
          <button className={`btn ${styles.btnSearch}`}>Search</button>
        </div>

        {/* Carousel */}
        <div id="carouselExampleIndicators" ref={carouselRef} className={`carousel slide mt-5 ${styles.carousel}`} data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="https://picsum.photos/500/300?random=1" className={`d-block w-100 ${styles.mainImage}`} alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src="https://picsum.photos/500/300?random=2" className={`d-block w-100 ${styles.mainImage}`} alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src="https://picsum.photos/500/300?random=3" className={`d-block w-100 ${styles.mainImage}`} alt="Slide 3" />
            </div>
          </div>
        </div>

        {/* Custom controls linked to the carousel */}
        <div className={`custom-controls mt-4 ${styles.customControls}`}>
          <button className={`btn ${styles.customBtn}`} onClick={goToPreviousSlide}>previous</button>
          <div className={styles.dotIndicators}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
          </div>
          <button className={`btn ${styles.customBtn}`} onClick={goToNextSlide}>next</button>
        </div>

        <h3 className={`carousel-title mt-2 ${styles.carouselTitle}`}>CECS</h3>

        {/* Social Media Icons */}
        <div className={`social-icons mt-5 ${styles.socialIcons}`}>
          <a href="#" className={styles.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={styles.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={styles.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default RoomSearch2;
