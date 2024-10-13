
import React, { useState } from "react";
import "./Scheduling4.css"; // Import custom CSS
import { Form, Dropdown, DropdownButton, Button } from "react-bootstrap";

function Scheduling4() {
  const [selectedDepartment, setSelectedDepartment] = useState("CICS");

  // Handle department selection
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className="container scheduling-container">
      {/* Dashboard Heading */}
      <div className="d-flex align-items-center mb-3">
        <button className="btn btn-link p-0 me-3 back-button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2 className="dashboard-title">
          Dashboard <span className="fw-light">Scheduling</span>
        </h2>
      </div>

      {/* Department Dropdown */}
      <div className="d-flex align-items-center mb-4">
        <Form.Label className="fs-5 fw-bold me-3 department-label">Department</Form.Label>
        <DropdownButton
          id="department-dropdown"
          title={selectedDepartment}
          onSelect={handleDepartmentChange}
          className="department-dropdown"
        >
          <Dropdown.Item eventKey="CICS">CICS</Dropdown.Item>
          <Dropdown.Item eventKey="CTE">CTE</Dropdown.Item>
          <Dropdown.Item eventKey="CAS">CAS</Dropdown.Item>
          <Dropdown.Item eventKey="CABE">CABE</Dropdown.Item>
        </DropdownButton>
      </div>

      {/* White Content Block */}
      <div className="content-block"></div>

      {/* Department Abbreviations */}
      <div className="d-flex justify-content-around department-codes"> {/* Changed to justify-content-around for equal spacing */}
        <span className="code-item">CECS</span>
        <span className="code-item">GZB</span>
        <span className="code-item">AAB</span>
        <span className="code-item">HEB</span>
      </div>

      {/* Box Row */}
      <div className="box-row">
        {[...Array(7)].map((_, index) => ( /* Changed to 7 boxes to match the second image */
          <div key={index} className="box-item"></div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="navigation-buttons">
        <Button className="nav-button">
          <i className="bi bi-arrow-left"></i>
        </Button>
        <Button className="nav-button">
          <i className="bi bi-arrow-right"></i>
        </Button>
      </div>
    </div>
  );
}

export default Scheduling4;
