import React, { useState } from "react";
import { Table, DropdownButton, Dropdown, Button, Form } from "react-bootstrap"; // Add Form here
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Icons for edit and delete
import "./Scheduling5.css"; // Import custom CSS

function Scheduling5() {
  const [selectedDepartment, setSelectedDepartment] = useState("CICS");

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
        <Form.Label className="fs-5 fw-bold me-3 department-label">Departments</Form.Label>
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
        <Button className="add-button ms-auto">+ add</Button>
      </div>

      {/* Table */}
      <Table bordered className="scheduling-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Class</th>
            <th>Professor</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>Class {index + 1}</td>
              <td>Professor {index + 1}</td>
              <td>08:00 AM - 10:00 AM</td>
              <td className="action-icons">
                <FaEdit className="edit-icon" />
                <FaTrashAlt className="delete-icon ms-3" />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Scheduling5;
