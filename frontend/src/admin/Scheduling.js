import React, { useState, useRef, useEffect } from "react";
import "./Scheduling.css";
import { cur } from "../App";

function Scheduling() {
    const [dept, setDept] = useState('');
    const selectRef = useRef(null);
    const selectChange = (e) => {
      cur.dept = e.target.value;
      console.log(cur.dept);
      setDept(e.target.value);
    };

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
        <div>
            <label htmlFor="dept" className="font-weight-bold mr-2">{(dept === '') ? "Choose Department" : dept}</label>
            <select id="dept" className="form-control d-inline-block w-auto mr-3" name="deptSelection" 
              ref={selectRef}
              onChange={selectChange}>
              <option value="">Choose here.</option>
              <option value="cics">CICS</option>
              <option value="cte">CTE</option>
              <option value="cas">CAS</option>
              <option value="cabe">CABE</option>
            </select>
        </div>
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