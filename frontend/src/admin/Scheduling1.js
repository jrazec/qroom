import React, { useState } from "react";
import "./Scheduling1.css"; // Updated CSS file for consistent colors
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";

function Scheduling1() {
  const [selectedDepartment, setSelectedDepartment] = useState("CICS");
  const [professors, setProfessors] = useState(["", "", ""]);

  // Handle department change
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
  };

  // Handle input change for professor names
  const handleProfessorChange = (index, event) => {
    const newProfessors = [...professors];
    newProfessors[index] = event.target.value;
    setProfessors(newProfessors);
  };

  return (
    <div className="container mt-5 modern-container">
      {/* Dashboard Heading */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-link p-0 me-3 modern-back-button">
          <i className="bi bi-arrow-left"></i>
        </button>
        <h2 className="dashboard-title">
          Dashboard <span className="fw-light">Scheduling</span>
        </h2>
      </div>

      {/* Department Dropdown */}
      <Form.Group className="mb-4">
        <Form.Label className="fs-5 fw-bold" style={{ color: "#a90000" }}>Department</Form.Label>
        <DropdownButton
          id="department-dropdown"
          title={selectedDepartment}
          onSelect={handleDepartmentChange}
          className="modern-dropdown"
        >
          <Dropdown.Item eventKey="CICS">CICS</Dropdown.Item>
          <Dropdown.Item eventKey="CTE">CTE</Dropdown.Item>
          <Dropdown.Item eventKey="CAS">CAS</Dropdown.Item>
          <Dropdown.Item eventKey="CABE">CABE</Dropdown.Item>
        </DropdownButton>
      </Form.Group>

      {/* Professor Assignment Section */}
      <div className="professor-assign-container p-4 mb-4">
        <h4 className="fw-bold text-white mb-3">Assign Professors</h4>
        <div className="professor-list">
          {professors.map((professor, index) => (
            <Form.Control
              key={index}
              type="text"
              placeholder="Professor Names"
              value={professor}
              onChange={(e) => handleProfessorChange(index, e)}
              className="professor-input mb-3"
            />
          ))}
        </div>
      </div>

      {/* Proceed Button */}
      <div className="text-end">
        <Button variant="danger" size="lg" className="modern-proceed-button">
          PROCEED
        </Button>
      </div>
    </div>
  );
}

export default Scheduling1;