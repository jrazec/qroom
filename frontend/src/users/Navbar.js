// Navbar.js
import React from 'react';
import Nav from './Navbar.module.css';
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

function Navbar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(`/user/home/${id}`);
  };

  const showBackButton = [
    `/user/schedule/${id}`,
    `/user/room-search/${id}`
  ].includes(location.pathname);

  return (
    <div id="navbar">
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

      {showBackButton && (
        <div className={Nav['back-icon-container']}>
          <FaArrowLeft onClick={handleBack} className={Nav['back-icon']} />
        </div>
      )}
    </div>
  );
}

export default Navbar;
