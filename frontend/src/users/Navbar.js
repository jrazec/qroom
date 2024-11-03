// frontend/users/Navbar.js
import React from 'react';
import Nav from './Navbar.module.css';
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

function Navbar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle navigation back to Home page
  const handleBack = () => {
    navigate(`/user/home/${id}`);
  };

  // Only show the back button on Schedule and Rooms pages
  const showBackButton = [
    `/user/schedule/${id}`,
    `/user/room-search/${id}`
  ].includes(location.pathname);

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
          <Link to={`/user/settings/${id}`} className={Nav['nav-item']}>Settings</Link>
        </nav>
      </header>

      {/* Back to Home Icon Button */}
      {showBackButton && (
        <div className={Nav['back-icon-container']}>
          <FaArrowLeft onClick={handleBack} className={Nav['back-icon']} />
        </div>
      )}

      {/* Bottom Navbar */}
      <nav className={Nav['bottom-nav']}>
        <a href={`/user/home/${id}`}><i className="fa fa-home"></i></a>
        <a href={`/user/room-search/${id}`}><i className="fa fa-search"></i></a>
        <a href={`/user/schedule/${id}`}><i className="fa fa-calendar"></i></a>
        <a href={`/user/feedback/${id}`}><i className="fa fa-envelope"></i></a>
        <a href={`/user/settings/${id}`}><i className="fa fa-cog"></i></a>
      </nav>
    </div>
  );
}

export default Navbar;
