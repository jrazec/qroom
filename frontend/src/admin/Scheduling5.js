import React, { useState } from "react";
import {
  Table,
  DropdownButton,
  Dropdown,
  Button,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";
import { FaTrashAlt } from "react-icons/fa";
import "./Scheduling5.css";

function Scheduling5() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [studentsWithoutSection, setStudentsWithoutSection] = useState([
    { id: "SR-001", firstName: "Alice", lastName: "Smith", department: "CICS" },
    { id: "SR-002", firstName: "Bob", lastName: "Jones", department: "CAS" },
    { id: "SR-003", firstName: "Charlie", lastName: "Brown", department: "CICS" },
    { id: "SR-004", firstName: "Daisy", lastName: "Miller", department: "CTE" },
  ]);
  const [studentsWithSection, setStudentsWithSection] = useState([
    { id: "SR-005", firstName: "Eve", lastName: "Adams", department: "CICS", section: "BSIT 1101" },
    { id: "SR-006", firstName: "Frank", lastName: "Harris", department: "CAS", section: "BSPSYCH 1101" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentsToAdd, setStudentsToAdd] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const departmentSections = {
    CICS: ["BSIT 1101", "BSIT 1102", "BSIT 1103","BSIT 1104", "BSIT 1105", "BSIT 1106","BSIT 1107", "BSIT 1108", "BSIT 2101","BSIT 2102", "BSIT 2103", "BSIT 2104", "BSIT 2105","BSIT BA 3101","BSIT BA 3102","BSIT NT 3101","BSIT SM 3101","BSIT SM 3102","BSIT BA 4101","BSIT BA 4102","BSIT SM 4101","BSIT NT 4101","BSIT NT 4102"],
    CAS: ["BSPSYCH 1101", "BSPSYCH 1102"],
    CTE: ["BEED 1101", "BSED 1101"],
    CABE: ["BSBA 1101", "BSBA 1102"],
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    setSelectedSection(null); // Reset section
  };

  const handleAddButtonClick = () => {
    const filteredStudents = studentsWithoutSection.filter(
      (student) => student.department === selectedDepartment
    );
    setStudentsToAdd(
      filteredStudents.map((student) => ({
        ...student,
        isSelected: false,
      }))
    );
    setShowAddModal(true);
  };

  const handleSelectAllToggle = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setStudentsToAdd((prev) =>
      prev.map((student) => ({ ...student, isSelected: newSelectAll }))
    );
  };

  const handleStudentToggle = (id) => {
    setStudentsToAdd((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, isSelected: !student.isSelected }
          : student
      )
    );
  };
  const handleDeleteButtonClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = () => {
    // Placeholder for the PUT request to update the backend
    // Example: axios.put('/api/removeStudent', { studentId: studentToDelete.id })
  
    // Remove the student from the studentsWithSection array
    setStudentsWithSection((prev) =>
      prev.filter((student) => student.id !== studentToDelete.id)
    );
  
    // Add the student back to the studentsWithoutSection array
    setStudentsWithoutSection((prev) => [...prev, studentToDelete]);
  
    console.log(`Student removed and added back to studentsWithoutSection: ${studentToDelete.firstName}`);
  
    // Close the delete modal
    setShowDeleteModal(false);
  };
  
  const handleAddSelected = () => {
    const selectedStudents = studentsToAdd.filter((student) => student.isSelected);

    if (selectedStudents.length === 0) {
      setMessage({ type: "error", text: "Please select at least one student to add." });
      return;
    }

    // Add selected students to the section
    setStudentsWithSection((prev) => [
      ...prev,
      ...selectedStudents.map((student) => ({
        ...student,
        section: selectedSection,
      })),
    ]);

    // Remove the added students from the studentsWithoutSection list
    setStudentsWithoutSection((prev) =>
      prev.filter(
        (student) => !selectedStudents.some((selected) => selected.id === student.id)
      )
    );

    // Success message
    setMessage({ type: "success", text: "Students successfully added to the section." });
    setShowAddModal(false);
  };

  const filteredStudentsWithSection = studentsWithSection.filter(
    (student) =>
      student.department === selectedDepartment &&
      student.section === selectedSection
  );

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

      {/* Department and Section Dropdowns */}
      <div className="d-flex align-items-center mb-4">
        <Form.Label className="fs-5 fw-bold me-3 department-label">
          Departments
        </Form.Label>
        <DropdownButton
          id="department-dropdown"
          title={selectedDepartment || "Department"}
          onSelect={handleDepartmentChange}
          className="department-dropdown"
        >
          {Object.keys(departmentSections).map((dept) => (
            <Dropdown.Item key={dept} eventKey={dept}>
              {dept}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton
          id="section-dropdown"
          title={selectedSection || "Section"}
          onSelect={setSelectedSection}
          className="department-dropdown"
        >
          {departmentSections[selectedDepartment]?.map((section) => (
            <Dropdown.Item key={section} eventKey={section}>
              {section}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Button
          className="add-button ms-auto"
          onClick={handleAddButtonClick}
          disabled={!selectedDepartment || !selectedSection}
        >
          + Add
        </Button>
      </div>

      {/* Table */}
      <Table bordered className="scheduling-table">
        <thead>
          <tr>
            <th>SR Code</th>
            <th>Section</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedDepartment && selectedSection ? (
            filteredStudentsWithSection.length > 0 ? (
              filteredStudentsWithSection.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.section}</td>
                  <td>{student.firstName}</td>
                  <td>{student.lastName}</td>
                  <td>
                    <FaTrashAlt
                      className="delete-icon"
                      onClick={() => handleDeleteButtonClick(student)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No students found for the selected department and section.
                </td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                Please select a department and section.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Add Students Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Students</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Check
              type="checkbox"
              label={selectAll ? "Deselect All" : "Select All"}
              checked={selectAll}
              onChange={handleSelectAllToggle}
            />
          </div>
          <hr />
          <Table bordered>
            <thead>
              <tr>
                <th>Select</th>
                <th>SR Code</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {studentsToAdd.map((student) => (
                <tr key={student.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={student.isSelected}
                      onChange={() => handleStudentToggle(student.id)}
                    />
                  </td>
                  <td>{student.id}</td>
                  <td>
                    {student.firstName} {student.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Warning Message */}
          {message.type === "error" && (
            <Alert variant="danger" className="mt-3">
              {message.text}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSelected}>
            Add Selected
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this student from the section?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Yes, Remove
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Scheduling5;
