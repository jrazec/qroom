import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import RoomCss from './RoomPage.module.css';
import { useParams, useNavigate } from 'react-router-dom';

function RoomPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Check if the user is authenticated by looking for a token in localStorage
    const token = localStorage.getItem('token');
    const loggedInUser = localStorage.getItem('user_name'); // Get logged-in user's username from localStorage

    if (!token) {
      // If no token, redirect to login page
      navigate('/user/login');
      return;
    }

    // If the user is trying to access another user's page
    if (id !== loggedInUser) {
      alert("Access forbidden");
      navigate('/'); // Redirect to the homepage or NotFound page
      return;
    }
  }, [id, navigate]);

  return (
    <div className={RoomCss.app}>
      <Navbar id={id} />

      <main className={RoomCss.mainContent}>
        <a href="#" className={RoomCss.socialIcon}>
          <i>sd</i>
        </a>
        <div className={RoomCss.socialIcons}>
          <a href="#" className={RoomCss.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={RoomCss.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={RoomCss.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default RoomPage;
