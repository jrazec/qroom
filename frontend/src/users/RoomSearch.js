import React, { useState } from 'react';
import Navbar from './Navbar';
import styles from './RoomSearch.module.css'; // Import the CSS module

function RoomSearch() {
  // State to hold dynamic schedule information
  const [schedule, setSchedule] = useState({
    Mon: { startTime: 8, endTime: 10 },   // Monday 8AM to 10AM
    Tue: { startTime: 10, endTime: 12 },  // Tuesday 10AM to 12PM
    Wed: { startTime: 11, endTime: 13 },  // Wednesday 11AM to 1PM
    Thu: { startTime: 9, endTime: 11 },   // Thursday 9AM to 11AM
    Fri: { startTime: 13, endTime: 15 },  // Friday 1PM to 3PM
  });

  // Convert time (7AM to 7PM) to percentage-based height for the rectangles
  const convertTimeToHeight = (start, end) => {
    const totalHours = 12; // 7AM to 7PM is 12 hours
    const blockStart = (start - 7) / totalHours * 100;
    const blockHeight = (end - start) / totalHours * 100;
    return { blockStart, blockHeight };
  };

  return (
    <div className={styles.app}>
      <Navbar />

      <main className={styles.mainContent}>
        <div className={styles.socialIcons}>
          <a href="#" className={styles.socialIcon}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={styles.socialIcon}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={styles.socialIcon}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>
        
        <div className={styles.backButton}>
          <button className="btn btn-link">
            <i className="fa fa-arrow-left"></i> Back
          </button>
        </div>

        <div className={`row justify-content-center align-items-center ${styles.mainLayout} mt-5 pt-5`}>
          {/* Left Section - Room Image and Status */}
          <div className={`col-md-5 text-center ${styles.leftSection}`}>
            <div className={styles.roomStatus}>
              <img
                src="https://picsum.photos/500/500"
                alt="Room Status"
                className={`${styles.roomImage} img-fluid`}
              />
              <h2 className="mt-3">CECS 501</h2>
              <p className={styles.roomOccupied}>OCCUPIED</p>
            </div>
          </div>

          {/* Right Section - Schedule */}
          <div className={`col-md-6 ${styles.rightSection} mx-4`}>
            <div className={styles.scheduleWrapper}>
              <div className={`${styles.scheduleUser} mb-3`}>
                <img
                  src="https://picsum.photos/150/150"
                  alt="User"
                  className={`${styles.userImage} img-fluid`}
                />
                <div className={styles.userDetails}>
                  <p><strong>Name:</strong> John Doe</p>
                  <p><strong>Department:</strong> Computer Science</p>
                  <p><strong>Section:</strong> A1</p>
                  <p><strong>Time:</strong> 10:00 AM - 12:00 PM</p>
                </div>
              </div>

              <div className={styles.scheduleGrid}>
                <div className={`d-flex justify-content-between mb-2 ${styles.scheduleDays}`}>
                  <div className={styles.scheduleDay}>MON</div>
                  <div className={styles.scheduleDay}>TUES</div>
                  <div className={styles.scheduleDay}>WED</div>
                  <div className={styles.scheduleDay}>THURS</div>
                  <div className={styles.scheduleDay}>FRI</div>
                </div>

                <div className={styles.scheduleBars}>
                  {Object.keys(schedule).map((day, index) => {
                    const { startTime, endTime } = schedule[day];
                    const { blockStart, blockHeight } = convertTimeToHeight(startTime, endTime);

                    return (
                      <div key={index} className="col">
                        <div
                          className={styles.scheduleBar}
                          style={{
                            top: `${blockStart}%`,
                            height: `${blockHeight}%`,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Previous Button */}
            <div className={styles.previousButton}>
              <button className="btn btn-outline-dark">Previous</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RoomSearch;
