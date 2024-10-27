import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Scheduling.css";
import { cur } from "../App";
import Scheduling1 from "./Scheduling1";

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
        <Link to="/admin/scheduling/4" class="text-white" id="addBtn"><button className="add-button">+add</button></Link>
      </div>

      <div className="circle-buttons">
      <Link to="/admin/scheduling/sections" class="text-white"><button className="circle-btn">Manage Sections</button></Link>
      <Link to="/admin/scheduling/courses" class="text-white"><button className="circle-btn">Manage Course</button></Link>
      <Link to="/admin/scheduling/class" class="text-white"><button className="circle-btn">Schedule Class</button></Link>
      </div>
    </div>
    </>


    );
}


export default Scheduling;