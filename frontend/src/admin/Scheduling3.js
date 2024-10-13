import React, { useState } from "react";
import "./Scheduling3.css"; // Updated CSS for consistent colors
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";

function Scheduling3() {
  const [selectedDepartment, setSelectedDepartment] = useState("CICS");

  // Handle department selection
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="container mt-5 scheduling-container">
      {/* Dashboard Heading */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link p-0 me-3 back-button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2 className="dashboard-title">
          Dashboard <span className="fw-light">Scheduling</span>
        </h2>
      </div>

      {/* Department Dropdown */}
      <Form.Group className="mb-4">
        <Form.Label className="fs-5 fw-bold" style={{ color: "#a90000" }}>
          Department
        </Form.Label>
        <DropdownButton
          id="department-dropdown"
          title={selectedDepartment}
          onSelect={handleDepartmentChange}
          className="modern-dropdown"
        >
          <Dropdown.Item eventKey="CICS">CICS</Dropdown.Item>
          <Dropdown.Item eventKey="CTE">CTE</Dropdown.Item>
          <Dropdown.Item eventKey="CAS">CAS</Dropdown.Item>
          <Dropdown.Item eventKey="CAS">CABE</Dropdown.Item>
        </DropdownButton>
      </Form.Group>

      {/* Scheduling Grid */}
      <div className="schedule-grid">
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
          <div key={index} className="day-column">
            <h5 className="day-header">{day}</h5>
            {/* Placeholder time blocks */}
            {index % 2 === 1 && <div className="time-block"></div>} {/* For some days */}
            {index === 2 && <div className="time-block"></div>}      {/* For Tuesday */}
            {index === 3 && <div className="time-block"></div>}      {/* For Wednesday */}
            {index === 5 && <div className="time-block"></div>}      {/* For Friday */}
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <Button variant="danger" className="nav-button">
          <i className="bi bi-arrow-left"></i>
        </Button>
        <Button variant="danger" className="nav-button">
          <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
    </div>
  );
}

export default Scheduling3;