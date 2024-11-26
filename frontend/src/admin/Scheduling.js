import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Scheduling.module.css";
import { cur } from "../App";
import Scheduling1 from "./Scheduling1";
import RoomPDFEditor from "./RoomPDFEditor"

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
      <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard-header"]}>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <h1 className="h2 font-weight-bold" styles={{color: '#800000'}}>Scheduling</h1>
        </div>
      </div>
      <div className={styles["circle-buttons"]}>
      <Link to="/admin/scheduling/sections" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Manage Sections</button></Link>
      <Link to="/admin/scheduling/courses" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Manage Course</button></Link>
      <Link to="/admin/scheduling/profselect" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Schedule Class</button></Link>
      </div>

      <div className={styles.deptHeader}>
        <h2>Department Room Assignment</h2>
        <Link to="/admin/scheduling/4" class="text-white text-decoration-none" id="addBtn"><button className={styles["add-button"]}>+add</button></Link>
      </div>
      <div className={styles["department-room-assignment"]}>
        
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
        <div className={styles["room-assignment-grid"]}>
          <div className={styles["room-column"]}>CICS</div>
          <div className={styles["room-column"]}>CTE</div>
          <div className={styles["room-column"]}>CAS</div>
          <div className={styles["room-column"]}>CABE</div>
        </div>
      </div>

      
    </div>
    <RoomPDFEditor />
    </>


    );
}


export default Scheduling;