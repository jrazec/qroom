import React, { useState, useEffect } from 'react';
import DonutChart from './charts/DonutChart'; // Ensure this component is responsive
import BarChart from './charts/BarChart'; // Ensure this component is responsive
import LineChart from './charts/LineChart'; // Additional chart example
import PieChart from './charts/PieChart'; // Additional chart example
import styles from './AdminDashboard.module.css';
import { Dropdown } from 'react-bootstrap';

const AdminDashboard = () => {
  const [usageFilter, setUsageFilter] = useState("Most Utilized Room");

  useEffect(() => {
    // Handle resizing for responsive charts
    const handleResize = () => {
      const chartCards = document.querySelectorAll(`.${styles.chartCard}`);
      chartCards.forEach((card) => {
        card.style.height = `${window.innerHeight / 3.5}px`;
      });
    };

    handleResize(); // Initial setup
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles["dashboard-container"]}>
      {/* Header */}
      <div className={styles.header}>
        <h1>
          Dashboard <span className={styles.subtitle}>Home</span>
        </h1>
      </div>

      {/* Main Content */}
      <div className={styles["main-content"]}>
        {/* First Row (Charts & Summary) */}
        <div className={styles.row1}>
          <div className={styles.chartContainer} style={{ width: "20%" }} >
              <DonutChart  />
              <h4 className={styles.chartTitle}>Overall Room Utilization</h4>
          </div>
            <div className={styles.summaryContainer}>
              <div className={styles.summaryCard}>
                <h4>Total Instructors</h4>
                <h2 className={styles.summaryValue}>12</h2>
              </div>
              <div className={styles.summaryCard}>
                <h4>Total Students</h4>
                <h2 className={styles.summaryValue}>6</h2>
              </div>
            </div>
          <div className={styles.chartContainer} style={{ width: "20%" }} >
              <PieChart  />
              <h4 className={styles.chartTitle}>Room Occupancy</h4>
          </div>
        </div>
        
        {/* Charts Row 2 */}
        <div className={styles.row2}>
          <div className={styles.chartContainer} style={{ width: "50%" }} >
                <LineChart />
              <h4 className={styles.chartTitle}>Room Utilization (Week)</h4>
          </div>
          
          <div className={styles.chartContainer} style={{ width: "50%" }}>
            <div className={styles.filterButtonContainer}>
              <Dropdown >
                <Dropdown.Toggle variant="danger" id="dropdown-basic" style={{ borderTopRightRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}>
                  {usageFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setUsageFilter('Most Utilized Room')}>Most Utilized</Dropdown.Item>
                  <Dropdown.Item onClick={() => setUsageFilter('Least Utilized Room')}>Least Utilized</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>
            <div className={styles.chartCard} >
              <BarChart filter={usageFilter} />
              <h4 className={styles.chartTitle}>Room Usage Breakdown</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
