import React, { useState, useRef, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import styles from "./Scheduling.module.css";
import { cur } from "../App";
import Scheduling1 from "./Scheduling1";
import RoomPDFEditor from "./RoomPDFEditor"

function Scheduling() {
    const [dept, setDept] = useState('');
    const selectRef = useRef(null);
    const location = useLocation();
    const mess = location.state?.mess || "";
    const selectChange = (e) => {
      cur.dept = e.target.value;
      console.log(cur.dept);
      setDept(e.target.value);
    };
    console.log(mess)

    const [showAlert, setShowAlert] = useState(true);

    const closeAlert = () => {
      setShowAlert(false);
    };

    return (
     <>
      <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard-header"]}>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <h1 className="h2 font-weight-bold" styles={{color: '#800000'}}>Scheduling</h1>
        </div>
      </div>
      {mess && showAlert && (
      <div className={`alert ${mess === "success" ? "alert-success" : "alert-danger"}`} role="alert">
        {mess === "success" ? "Operation was successful!" : "There was an error with the operation."}
        <button type="button" className="close" aria-label="Close" onClick={closeAlert}>
        <span aria-hidden="true">&times;</span>
        </button>
      </div>
      )}
      <div className={styles["circle-buttons"]}>
      <Link to="/admin/scheduling/sections" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Manage Sections</button></Link>
      <Link to="/admin/scheduling/profselect" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Create Schedule</button></Link>
      <Link to="/admin/scheduling/managesched" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Manage Schedule</button></Link>
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