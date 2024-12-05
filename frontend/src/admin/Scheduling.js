import React, { useState, useRef, useEffect } from "react";
import { Link,useLocation } from "react-router-dom";
import styles from "./Scheduling.module.css";
import { cur } from "../App";
import Scheduling1 from "./Scheduling1";
import RoomPDFEditor from "./RoomPDFEditor"
import axios from "axios";

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
    const [rooms, setRooms] = useState([]);
    const [showAlert, setShowAlert] = useState(true);

    const closeAlert = () => {
      setShowAlert(false);
    };
    useEffect(() => {
      axios
        .get(`${process.env.REACT_APP_LOCALHOST.replace("3000", "3001")}/admin/rooms`)
        .then((response) => {
          setRooms(response.data);
        })
        .catch((error) => {
          console.error("Error fetching rooms:", error);
        });
    }, []);

    const [filteredRooms, setFilteredRooms] = useState([]);

    const handleFilterChange = () => {
      const roomPurpose = document.getElementById("roomPurposeSlicer").value;
      const bldgName = document.getElementById("bldgNameSlicer").value;
      const floorNumber = document.getElementById("floorNumberSlicer").value;

      const filtered = rooms.filter(room => {
      return (
        (roomPurpose === "" || room.room_purpose === roomPurpose) &&
        (bldgName === "" || room.bldg_name === bldgName) &&
        (floorNumber === "" || room.floor_number === floorNumber)
      );
      });

      setFilteredRooms(filtered);
    };

    useEffect(() => {
      setFilteredRooms(rooms);
    }, [rooms]);

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
    <div className="d-flex justify-content-between my-3 align-items-center" style={{padding:"0rem 9rem"}}>
      <div className="d-flex justify-content-between my-3 align-items-center">
        <div style={{margin:"0 1rem"}}>
        <label htmlFor="roomPurposeSlicer">Room Purpose</label>
        <select id="roomPurposeSlicer" className="form-select" onChange={handleFilterChange}>
        <option value="">All</option>
        {[...new Set(rooms.map(room => room.room_purpose))].sort().map((purpose, index) => (
        <option key={index} value={purpose}>{purpose}</option>
        ))}
        </select>
        </div>
        <div style={{margin:"0 1rem"}}>
        <label htmlFor="bldgNameSlicer">Building Name</label>
        <select id="bldgNameSlicer" className="form-select" onChange={handleFilterChange}>
        <option value="">All</option>
        {[...new Set(rooms.map(room => room.bldg_name))].sort().map((bldg, index) => (
        <option key={index} value={bldg}>{bldg}</option>
        ))}
        </select>
        </div>
        <div style={{margin:"0 1rem"}}>
        <label htmlFor="floorNumberSlicer">Floor Number</label>
        <select id="floorNumberSlicer" className="form-select" onChange={handleFilterChange}>
        <option value="">All</option>
        {[...new Set(rooms.map(room => room.floor_number))].sort().map((floor, index) => (
        <option key={index} value={floor}>{floor}</option>
        ))}
        </select>
        </div>
      </div>
      <RoomPDFEditor />
    </div>
    <div className='d-flex flex-column justify-content-center align-items-center' style={{padding:"0rem 10rem"}}>
   
    <div style={{ height: "200px", width: "100%", overflowY: "auto" }}>
      {filteredRooms.map((room, index) => (
      <div
      key={index}
      className="d-flex flex-column align-items-start border p-3 rounded mb-2"
      >
      <label className="form-label">
      Room ID: {room.room_id}
      </label>
      <div>
      {room.name}
      </div>
      <div>
      Room Purpose: {room.room_purpose}
      </div>
      <div>
      Building Name: {room.bldg_name}
      </div>
      <div>
      Floor Number: {room.floor_number}
      </div>
      </div>
      ))}
    </div>

    </div>


    </>
    );
}


export default Scheduling;