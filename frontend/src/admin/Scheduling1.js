import React, { useState } from "react";
import "./Scheduling1.css"; // Updated CSS file for consistent colors
import { Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
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
          <Dropdown.Item eventKey="Bachelor of Science in Information Technology">Bachelor of Science in Information Technology</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Science in Management Accounting">Bachelor of Science in Management Accounting</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Science in Business Administration Major in Human Resource Management">Bachelor of Science in Business Administration Major in Human Resource Management</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Science in Business Administration Major in Operations Management">Bachelor of Science in Business Administration Major in Operations Management</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Science in Business Administration Major in Marketing Management">Bachelor of Science in Business Administration Major in Marketing Management</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Science in Psychology">Bachelor of Science in Psychology</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Arts in Communication">Bachelor of Arts in Communication</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Science in Industrial Engineering">Bachelor of Science in Industrial Engineering</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Industrial Technology - Computer Technology">Bachelor of Industrial Technology - Computer Technology</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Industrial Technology - Electrical Technology">Bachelor of Industrial Technology - Electrical Technology</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Industrial Technology - Electronics Technology">Bachelor of Industrial Technology - Electronics Technology</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Industrial Technology - Instrumentation and Control Technology">Bachelor of Industrial Technology - Instrumentation and Control Technology</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Secondary Education Major in English">Bachelor of Secondary Education Major in English</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Secondary Education Major in Mathematics">Bachelor of Secondary Education Major in Mathematics</Dropdown.Item>
          <Dropdown.Item eventKey="Bachelor of Secondary Education Major in Sciences">Bachelor of Secondary Education Major in Sciences</Dropdown.Item>
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
      <Link className="text-end" to="/admin/scheduling/4" class="text-white">
      <Button variant="danger" size="lg" className="modern-proceed-button">
          PROCEED
      </Button>
      </Link>

    </div>
  );
}

export default Scheduling1;