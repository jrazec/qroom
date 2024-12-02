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
      <Link to="/admin/scheduling/calendar" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Create Schedule</button></Link>
      <Link to="/admin/scheduling/managesched" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Manage Schedule</button></Link>
      <Link to="/admin/scheduling/sections" class="text-white text-decoration-none"><button className={styles["circle-btn"]}>Manage Sections</button></Link>
      </div>

      
    </div>
    <RoomPDFEditor />
    </>
    );
}


export default Scheduling;