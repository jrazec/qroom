import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <div>
      {/* Top Navbar */}
      <header className="header">
        <div className="logo">QRoom</div>
        <nav className="nav">
          <a href="/home" className="nav-item active">Home</a>
          <a href="/schedule" className="nav-item">Schedule</a>
          <a href="/rooms" className="nav-item">Rooms</a>
          <a href="/feedback" className="nav-item">Feedback</a>
        </nav>
      </header>

      {/* Bottom Navbar */}
      <nav className="bottom-nav">
        <a href="/home"><i className="fa fa-home"></i></a>
        <a href="/rooms"><i className="fa fa-search"></i></a>
        <a href="#"><i className="fa fa-instagram"></i></a>
        <a href="/schedule"><i className="fa fa-calendar"></i></a>
        <a href="/feedback"><i className="fa fa-envelope"></i></a>
      </nav>
    </div>
  );
}

export default Navbar;
