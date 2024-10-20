import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ScheduleCss from './SchedulePage.module.css';
import { useParams } from 'react-router-dom';

function SchedulePage() {
  const {id} = useParams();

    // Define schedule as a state with temporary data
    const [schedule, setSchedule] = useState([
      { day: 'Mon', startTime: 7, endTime: 19 },  // Example: Monday 8AM - 10AM
      { day: 'Tue', startTime: 9, endTime: 12 },  // Tuesday 9AM - 12PM
      { day: 'Wed', startTime: 8, endTime: 10 },  // Wednesday 11AM - 2PM
      { day: 'Thu', startTime: 13, endTime: 15 },   // Thursday 3PM - 5PM
    ]);
  
    // Map days to their index positions
    const dayMap = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
    // Convert time (7AM to 7PM) to percentage-based height for the rectangles
    const convertTimeToPosition = (time) => ((time - 7) / 12) * 100;
  
  return (
    <div className={ScheduleCss.app}>
      <Navbar id={id}/>
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
              top: `${convertTimeToPosition(item.startTime)}%`,
              height: `${convertTimeToPosition(item.endTime) - convertTimeToPosition(item.startTime)}%`,
              left: `${dayMap.indexOf(item.day) * 14.28}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
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
