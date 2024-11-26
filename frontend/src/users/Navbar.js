import React from 'react';
import Nav from './Navbar.module.css';
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';

function Navbar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch the role from localStorage (assumes it's saved during login)
  const userRole = localStorage.getItem('role'); // Ensure 'role' is saved in LoginUser.js

  const handleBack = () => {
    navigate(`/user/home/${id}`);
  };

  // Define the routes where you want to show the back button
  const showBackButton = [
    `/user/schedule/${id}`,
    `/user/room-search/${id}`,
    `/user/room-search/${id}/floor/${id}`,
    `/user/room-search/${id}/room/${id}`
  ].includes(location.pathname);

  // Get the current path
  const currentPath = location.pathname;

  return (
    <div id="navbar">
      <header className={Nav.header}>
        <div className={Nav.logo}>QRoom</div>
        <nav className={Nav.nav}>
          <Link 
            to={`/user/home/${id}`} 
            className={`${Nav['nav-item']} ${currentPath === `/user/home/${id}` ? Nav.active : ''}`}
          >
            Home
          </Link>
          <Link 
            to={`/user/schedule/${id}`} 
            className={`${Nav['nav-item']} ${currentPath === `/user/schedule/${id}` ? Nav.active : ''}`}
          >
            Schedule
          </Link>
          <Link 
            to={`/user/room-search/${id}`} 
            className={`${Nav['nav-item']} ${currentPath === `/user/room-search/${id}` ? Nav.active : ''}`}
          >
            Rooms
          </Link>

          {/* Conditional Rendering: Feedback for Students, Dashboard for Instructors */}
          {userRole && userRole.toLowerCase() === "instructor" ? (
            <Link 
              to={`/user/dashboard/${id}`} 
              className={`${Nav['nav-item']} ${currentPath === `/user/dashboard/${id}` ? Nav.active : ''}`}
            >
              Dashboard
            </Link>
          ) : userRole && userRole.toLowerCase() === "student" ? (
            <Link 
              to={`/user/feedback/${id}`} 
              className={`${Nav['nav-item']} ${currentPath === `/user/feedback/${id}` ? Nav.active : ''}`}
            >
              Feedback
            </Link>
          ) : null}

          <Link 
            to={`/user/settings/${id}`} 
            className={`${Nav['nav-item']} ${currentPath === `/user/settings/${id}` ? Nav.active : ''}`}
          >
            Settings
          </Link>
        </nav>
      </header>

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
        {userRole && userRole.toLowerCase() === "instructor" && (
          <a href={`/user/dashboard/${id}`}><i className="fa fa-dashboard"></i></a>
        )}
        {userRole && userRole.toLowerCase() === "student" && (
          <a href={`/user/feedback/${id}`}><i className="fa fa-envelope"></i></a>
        )}
        <a href={`/user/settings/${id}`}><i className="fa fa-cog"></i></a>
      </nav>
      <div className={Nav.socialIcons}>
        <a href="#" className={Nav.socialIcon}>
          <i className="fa fa-brands fa-facebook"></i>
        </a>
        <a href="#" className={Nav.socialIcon}>
          <i className="fa fa-envelope"></i>
        </a>
        <a href="#" className={Nav.socialIcon}>
          <i className="fa-brands fa-github"></i>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
