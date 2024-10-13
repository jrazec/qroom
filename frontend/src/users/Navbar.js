import React from 'react';
import Nav from './Navbar.module.css';

function Navbar() {
  return (
       <div id="navbar">
      {/* Top Navbar */}
      <header className={Nav.header}>
        <div className={Nav.logo}>QRoom</div>
        <nav className={Nav.nav}>
          <a href="/home" className={`${Nav['nav-item']} ${Nav.active}`}>Home</a>
          <a href="/schedule" className={Nav['nav-item']}>Schedule</a>
          <a href="/rooms" className={Nav['nav-item']}>Rooms</a>
          <a href="/feedback" className={Nav['nav-item']}>Feedback</a>
        </nav>
      </header>

      {/* Bottom Navbar */}
      <nav className={Nav['bottom-nav']}>
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