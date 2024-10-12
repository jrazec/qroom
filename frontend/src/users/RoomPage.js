import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './RoomPage.css';


function RoomPage() {

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">

        <div className="social-icons mt-5">
          <a href="#" className="social-icon">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className="social-icon">
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className="social-icon">
          <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default RoomPage;
