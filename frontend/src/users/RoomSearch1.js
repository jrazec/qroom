import React from 'react';
import Navbar from './Navbar';
import roomSearch1 from './RoomSearch1.module.css'; // Import the CSS module

function RoomSearch1({}) {
  return (
    <div className={roomSearch1.app}>
      <Navbar />
      <main className={roomSearch1.mainContent}>

        {/* Back Button (Top Left) */}
        <div className={roomSearch1.backButton}>
          <button className="btn btn-link text-danger">back</button>
        </div>

        {/* Search Bar */}
        <div className={`${roomSearch1.searchBar} mb-5 text-center`}>
          <input type="text" className={`form-control ${roomSearch1.searchInput} d-inline-block`} placeholder="search" />
          <button className={`btn btn-danger ${roomSearch1.searchBtn} d-inline-block ml-2`}>search</button>
        </div>

        {/* Main Section */}
        <div className="row justify-content-center">
          {/* Left Image Section */}
          <div className="col-lg-4 text-center mb-4">
            <img src="https://picsum.photos/200" alt="Room" className={`${roomSearch1.imgFluid} rounded shadow`} />
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
                <button key={idx} className={`list-group-item list-group-item-action text-center ${roomSearch1.roomBtn}`}>
                  CECS ROOM 501
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className={roomSearch1.socialIcons}>
          <a href="#" className={roomSearch1.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={roomSearch1.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={roomSearch1.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>

        {/* Previous Button (Bottom Right) */}
        <div className={roomSearch1.previousButton}>
          <button className="btn btn-danger">previous</button>
        </div>

      </main>
    </div>
  );
}

export default RoomSearch1;