import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import "./LayoutAdmin.css";

const Layout = () => {
  return (
    <div className="app">
      <aside className="sidebar">

          <div class="text-center" id="topNav">
            <h2 class="brand-title text-white pt-3">QRoom</h2>
            <div class="user-circle bg-light my-3"></div>
            <span class="text-white mb-4 d-block">Admin</span>
          </div>
      
        <nav id="botNav">
            <ul class="nav flex-column">
              <li class="nav-item">
              <Link to="/admin" class="nav-link text-white active">Home</Link>
              </li>
              <li class="nav-item">
                <Link to="/admin/accounts" class="nav-link text-white">Accounts</Link>
              </li>
              <li class="nav-item">
                <Link to="/admin/scheduling" class="nav-link text-white">Scheduling</Link>
              </li>
              <li class="nav-item">
                <Link to="/admin/feedback" class="nav-link text-white">Feedback</Link>
              </li>
              <li class="nav-item">
                <Link to="/" class="nav-link text-white">logout</Link>
              </li>
            </ul>

        </nav>


      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
};

export default Layout;


