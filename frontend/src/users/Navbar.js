import React from 'react';
import Nav from './Navbar.module.css';
import { Outlet, Link,useParams } from "react-router-dom";

function Navbar() {
  const {id} = useParams();
  return (
       <div id="navbar">
      {/* Top Navbar */}
      <header className={Nav.header}>
        <div className={Nav.logo}>QRoom</div>
        <nav className={Nav.nav}>
          <Link to={`/user/home/${id}`} className={`${Nav['nav-item']} ${Nav.active}`}>Home</Link>
          <Link to={`/user/schedule/${id}`} className={Nav['nav-item']}>Schedule</Link>
          <Link to={`/user/room-search/${id}`} className={Nav['nav-item']}>Rooms</Link>
          <Link to={`/user/feedback/${id}`} className={Nav['nav-item']}>Feedback</Link>
        </nav>
      </header>

      {/* Bottom Navbar */}
      <nav className={Nav['bottom-nav']}>
        <a href={`/user/home/${id}`}><i className="fa fa-home"></i></a>
        <a href={`/user/room-search/${id}`}><i className="fa fa-search"></i></a>
        <a href={`/user/schedule/${id}`}><i className="fa fa-calendar"></i></a>
        <a href={`/user/feedback/${id}`}><i className="fa fa-envelope"></i></a>
      </nav>
    </div>
  );
}

export default Navbar;