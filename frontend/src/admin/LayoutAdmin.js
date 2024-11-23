import { Outlet, Link, useLocation } from "react-router-dom";
import React from 'react';
import "./LayoutAdmin.css";

const Layout = () => {
  const location = useLocation(); // Get the current location

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
                to="/admin"
                className={`nav-link text-white ${
                  location.pathname === "/admin" ? "active" : ""
                }`}
              >
                Home
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
                to="/"
                className={`nav-link text-white ${
                  location.pathname === "/" ? "active" : ""
                }`}
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
