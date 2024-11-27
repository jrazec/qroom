import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import React from 'react';
import "./LayoutAdmin.css";

const Layout = () => {
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Get the navigate function

  // Handle Logout
  const handleLogout = () => {
    // Clear localStorage to log the user out
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('role');
  
    // Redirect to admin login page, replacing current history entry to prevent going back
    navigate("/admin/login", { replace: true });
  };
  

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="text-center" id="topNav">
          <h2 className="brand-title text-white pt-3">QRoom</h2>
          <div className="user-circle bg-light my-3"></div>
          <span className="text-white mb-4 d-block">Admin</span>
        </div>

        <nav id="botNav">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link
                to="/admin/dashboard"
                className={`nav-link text-white ${
                  location.pathname === "/admin/dashboard" ? "active" : ""
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/accounts"
                className={`nav-link text-white ${
                  location.pathname === "/admin/accounts" ? "active" : ""
                }`}
              >
                Accounts
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/scheduling"
                className={`nav-link text-white ${
                  location.pathname === "/admin/scheduling" ? "active" : ""
                }`}
              >
                Scheduling
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/admin/feedback"
                className={`nav-link text-white ${
                  location.pathname === "/admin/feedback" ? "active" : ""
                }`}
              >
                Feedback
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="#"
                onClick={handleLogout}
                className="nav-link text-white"
              >
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
