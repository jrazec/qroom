import React from 'react';
import Nav from './Navbar.module.css';
import { Outlet, Link } from "react-router-dom";

function Navbar() {
  return (
       <div id="navbar">
      {/* Top Navbar */}
      <header className={Nav.header}>
        <div className={Nav.logo}>QRoom</div>
        <nav className={Nav.nav}>
          <Link to="/user/home/id" className={`${Nav['nav-item']} ${Nav.active}`}>Home</Link>
          <Link to="/user/schedule/id" className={Nav['nav-item']}>Schedule</Link>
          <Link to="/user/room-search/id" className={Nav['nav-item']}>Rooms</Link>
          <Link to="/user/feedback/id" className={Nav['nav-item']}>Feedback</Link>
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