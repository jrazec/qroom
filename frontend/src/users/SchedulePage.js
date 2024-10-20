import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ScheduleCss from './SchedulePage.module.css';
import { useParams } from 'react-router-dom';
import { getUserSchedule } from '../api/api';

function SchedulePage() {
  const {id} = useParams();

    // Define schedule as a state with temporary data
    const [schedule, setSchedule] = useState([
      { day: 'Mon', time_start: 7, time_end: 19 },  // Example: Monday 8AM - 10AM
      { day: 'Tue', time_start: 9, time_end: 12 },  // Tuesday 9AM - 12PM
      { day: 'Wed', time_start: 8, time_end: 10 },  // Wednesday 11AM - 2PM
      { day: 'Thu', time_start: 13, time_end: 15 },   // Thursday 3PM - 5PM
    ]);
  
    // Map days to their index positions
    const dayMap = ['Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];
  // Convert function definition (ensure it's above your setSchedule call)
  const convertTimeToDecimal = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number); // Split and convert to numbers
    const decimalHours = hours + (minutes / 60); // Calculate decimal hours
    return decimalHours.toFixed(2); // Format to two decimal places
  };
  const shortenDay = (day) =>{
    switch (day) {
      case "Monday":
        return "Mon";
      case "Tuesday":
        return "Tues";
      case "Wednesday":
        return "Wed";
      case "Thursday":
        return "Thur";
      case "Friday":
        return "Fri";
      case "Saturday":
        return "Sat";
    }
  }

    // Convert time (7AM to 7PM) to percentage-based height for the rectangles
    const convertTimeToPosition = (time) => ((time - 7) / 12) * 100;
    useEffect(() => {
      const fetchData = async () => {
          try {
              console.log("Fetching data...");
              const fetchedData = await getUserSchedule(id);
              setSchedule(fetchedData.result.map(item => ({
                ...item, // Keep existing properties
                day: shortenDay(item.day),
                time_start: convertTimeToDecimal(item.time_start), // Convert time_start
                time_end: convertTimeToDecimal(item.time_end),     // Convert time_end
            })));
          } catch (error) {
              console.error('Error fetching user schedule:', error);
          }
      };

      if (id) { // Ensure id is defined before fetching
          fetchData();
      }
    }, []); // Add id as a dependency to refetch when it changes
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
              top: `${convertTimeToPosition(item.time_start)}%`,
              height: `${convertTimeToPosition(item.time_end) - convertTimeToPosition(item.time_start)}%`,
              left: `${dayMap.indexOf(item.day) * 14.28}%`,
            }}
          >

            <div className={ScheduleCss.topBlock}>{(item.time_start > 12.60) ? `${parseFloat(item.time_start - 12).toFixed(2)}`.replace('.',':').concat('pm'): `${item.time_start}`.replace('.',':').concat('am')}</div>
            <div className={ScheduleCss.botBlock}>{(item.time_end > 12.60) ? `${parseFloat(item.time_end - 12).toFixed(2)}`.replace('.',':').concat('pm'):`${item.time_end}`.replace('.',':').concat('am')}</div>
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
