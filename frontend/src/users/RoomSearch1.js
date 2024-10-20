import React from 'react';
import Navbar from './Navbar';
import styles from './RoomSearch1.module.css'; // Import the CSS module

function RoomSearch1({}) {
  return (
    <div className={styles.app}>
      <Navbar />
      <main className={styles.mainContent}>

        {/* Back Button (Top Left) */}
        <div className={styles.backButton}>
          <button className="btn btn-link text-danger">back</button>
        </div>

        {/* Search Bar */}
        <div className={`${styles.searchBar} mb-5 text-center`}>
          <input type="text" className={`form-control ${styles.searchInput} d-inline-block`} placeholder="search" />
          <button className={`btn btn-danger ${styles.searchBtn} d-inline-block ml-2`}>search</button>
        </div>

        {/* Main Section */}
        <div className="row justify-content-center">
          {/* Left Image Section */}
          <div className="col-lg-4 text-center mb-4">
            <img src="https://picsum.photos/200" alt="Room" className={`${styles.imgFluid} rounded shadow`} />
            <h3 className="mt-3">CECS</h3>
          </div>

          {/* Right Grid Section */}
          <div className="col-lg-8">
            <div className="row mb-3">
              {/* Top image grid */}
              {[...Array(4)].map((_, idx) => (
                <div key={idx} className="col-3">
                  <img src="https://picsum.photos/100" alt="UX/UI" className="img-fluid rounded shadow-sm" />
                </div>
              ))}
            </div>

            {/* Room buttons */}
            <div className="list-group">
              {[...Array(4)].map((_, idx) => (
                <button key={idx} className={`list-group-item list-group-item-action text-center ${styles.roomBtn}`}>
                  CECS ROOM 501
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className={styles.socialIcons}>
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

        {/* Previous Button (Bottom Right) */}
        <div className={styles.previousButton}>
          <button className="btn btn-danger">previous</button>
        </div>

      </main>
    </div>
  );
}

export default RoomSearch1;
