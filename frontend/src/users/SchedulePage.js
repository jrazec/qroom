import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ScheduleCss from './SchedulePage.module.css';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserSchedule } from '../api/api';
import { convertTimeToPosition, fetchData } from './sched-bar/schedBarModules';

function SchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Define schedule as a state with temporary data
  const [schedule, setSchedule] = useState([]);
  
  // Map days to their index positions
  const dayMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
      navigate("/not-found"); // Redirect to the homepage or NotFound page
      return;
    }

    if (id) { 
      fetchData(id, getUserSchedule, setSchedule); // Fetch the schedule
    }
  }, [id, navigate]);

  return (
    <div className={ScheduleCss.app}>
      <Navbar id={id} />
      <main className={ScheduleCss.mainContent}>
        <div className={ScheduleCss.scheduleContainer}>
          <div className={`${ScheduleCss.days} d-flex justify-content-between`}>
            {dayMap.map((day, index) => (
              <div key={index} className={ScheduleCss.dayLabel}>
                {day}
              </div>
            ))}
          </div>
          <div className={ScheduleCss.scheduleContent}>
            {schedule.map((item, index) => (
              <div
                key={index}
                className={ScheduleCss.scheduleBlock}
                style={{
                  top: `${convertTimeToPosition(item.time_start)}%`,
                  height: `${convertTimeToPosition(item.time_end) - convertTimeToPosition(item.time_start)}%`,
                  left: `${dayMap.indexOf(item.day) * 14.28}%`,
                }}
              >
                <div className={ScheduleCss.topBlock}>
                  {(item.time_start > 12.60) ? `${parseFloat(item.time_start - 12).toFixed(2)}`.replace('.',':').concat('pm') : `${item.time_start}`.replace('.',':').concat('am')}
                </div>
                <div className={ScheduleCss.botBlock}>
                  {(item.time_end > 12.60) ? `${parseFloat(item.time_end - 12).toFixed(2)}`.replace('.',':').concat('pm') : `${item.time_end}`.replace('.',':').concat('am')}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={ScheduleCss.socialIcons}>
          <a href="#" className={ScheduleCss.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={ScheduleCss.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={ScheduleCss.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default SchedulePage;
