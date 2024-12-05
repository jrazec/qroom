import React, { useState, useEffect } from 'react';
import DonutChart from './charts/DonutChart'; // Ensure this component is responsive
import BarChart from './charts/BarChart'; // Ensure this component is responsive
import LineChart from './charts/LineChart'; // Additional chart example
import styles from './AdminDashboard.module.css';
import { Dropdown } from 'react-bootstrap';
import AdminFDashboard from './AdminFDashboard';


const AdminDashboard = () => {
  const [usageFilter, setUsageFilter] = useState("Most Utilized Room");
  const [isAdminFDashboard, setIsFAdminDashboard] = useState(false);

  const toggleDashboard = () => {
    setIsFAdminDashboard(!isAdminFDashboard);
  };

  if (isAdminFDashboard) {
    return <AdminFDashboard />;
  }

  return (
    <div className={styles["dashboard-container"]}>
          <button
            onClick={toggleDashboard}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              padding: "10px 20px",
              backgroundColor: "white",
              color: "maroon",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Switch to Room Occupancy Status
          </button>
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
          <div className={styles.chartContainer} style={{width: '40%'}} >
            <div className={styles.chartCard}>
              <h4 className={styles.chartTitle}>Overall Room Utilization</h4>
              <DonutChart  />
            </div>
              
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
              <h4 className={styles.chartTitle}>Room Usage Breakdown</h4>
              <BarChart filter={usageFilter} />
            </div>
          </div>
        </div>
        
        {/* Charts Row 2 */}
        <div className={styles.row2}>
          <div className={styles.chartContainer} style={{ width: "50%" }} >
              <div className={styles.chartCard}>
              <h4 className={styles.chartTitle}>Room Utilization (Week)</h4>
              <LineChart />
              </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
