import React from "react";
import "./Scheduling.css";

function Scheduling() {
    return (
     <>
      <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Dashboard <span className="sub-title">Scheduling</span>
        </h1>
      </div>

      <div className="department-room-assignment">
        <h2>Department Room Assignment</h2>
        <div className="room-assignment-grid">
          <div className="room-column">CICS</div>
          <div className="room-column">CTE</div>
          <div className="room-column">CAS</div>
          <div className="room-column">CABE</div>
        </div>
        <button className="add-button">+ Add</button>
      </div>

      <div className="circle-buttons">
        <button className="circle-btn">Manage Sections</button>
        <button className="circle-btn">Manage Course</button>
        <button className="circle-btn">Schedule Class</button>
      </div>
    </div>
    </>


    );
}


export default Scheduling;