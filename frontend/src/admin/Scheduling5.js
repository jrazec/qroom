import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  DropdownButton,
  Dropdown,
  Button,
  Form,
  Modal,
  Alert,
} from "react-bootstrap";
import { FaArrowLeft, FaPlus, FaTrashAlt, FaTimes } from "react-icons/fa";
import styles from "./Scheduling5.module.css";
import { useEffect } from "react";
import axios from "axios";
function Scheduling5() {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [studentsWithoutSection, setStudentsWithoutSection] = useState([
    { user_name: "SR-001", first_name: "Alice", last_name: "Smith", department: "CICS" },
    { user_name: "SR-002", first_name: "Bob", last_name: "Jones", department: "CAS" },
    { user_name: "SR-003", first_name: "Charlie", last_name: "Brown", department: "CICS" },
    { user_name: "SR-004", first_name: "Daisy", last_name: "Miller", department: "CTE" },
  ]);
  const [studentsWithSection, setStudentsWithSection] = useState([
    { user_name: "SR-005", first_name: "Eve", last_name: "Adams", department: "CICS", section_name: "BSIT 1101" },
    { user_name: "SR-006", first_name: "Frank", last_name: "Harris", department: "CAS", section_name: "BSPSYCH 1101" },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [studentsToAdd, setStudentsToAdd] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(`/admin/scheduling`);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/user-withWithoutSched`);
        const data = await response.json();
        const { status, results } = data;
        console.log(results.withSchedule)
        if (status) {
          setStudentsWithSection(results.withSchedule);
          setStudentsWithoutSection(results.withoutSchedule);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const departmentSections = {
    CICS: ["BSIT 1101", "BSIT 1102", "BSIT 1103","BSIT 1104", "BSIT 1105", "BSIT 1106","BSIT 1107", "BSIT 1108", "BSIT 2101","BSIT 2102", "BSIT 2103", "BSIT 2104", "BSIT 2105","BSIT BA 3101","BSIT BA 3102","BSIT NT 3101","BSIT SM 3101","BSIT SM 3102","BSIT BA 4101","BSIT BA 4102","BSIT SM 4101","BSIT NT 4101","BSIT NT 4102"],
    CAS: ["BSPSYCH 1101", "BSPSYCH 1102"],
    CTE: ["BEED 1101", "BSED 1101"],
    CABE: ["BSBA 1101", "BSBA 1102"],
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    setSelectedSection(null); // Reset section_name
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

  const handleStudentToggle = (user_name) => {
    setStudentsToAdd((prev) =>
      prev.map((student) =>
        student.user_name === user_name
          ? { ...student, isSelected: !student.isSelected }
          : student
      )
    );
  };
  const handleDeleteButtonClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };
  const handleDeleteConfirm = async () => {
    // Remove the student from the studentsWithSection array
    setStudentsWithSection((prev) =>
      prev.filter((student) => student.user_name !== studentToDelete.user_name)
    );



    // Close the delete modal
    setShowDeleteModal(false);
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/user-removeSection`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_name: studentToDelete.user_name }),
      });

      const data = await response.json();

      if (data.status) {
      console.log(`Student ${studentToDelete.user_name} removed from section successfully.`);
      } else {
      console.error("Failed to remove student from section.");
      }
    } catch (error) {
      console.error("Error removing student from section:", error);
    }
    // Remove the student from the studentsWithSection array
    setStudentsWithSection((prev) =>
      prev.filter((student) => student.user_name !== studentToDelete.user_name)
    );
  
    // Add the student back to the studentsWithoutSection array
    setStudentsWithoutSection((prev) => [...prev, studentToDelete]);
  
    console.log(`Student removed and added back to studentsWithoutSection: ${studentToDelete.first_name}`);
  
    // Close the delete modal
    setShowDeleteModal(false);
  };
  
  const handleAddSelected = async () => {
    const selectedStudents = studentsToAdd.filter((student) => student.isSelected);

    if (selectedStudents.length === 0) {
      setMessage({ type: "error", text: "Please select at least one student to add." });
      return;
    }

    const user_names = selectedStudents.map((student) => student.user_name);

    try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/add-user-to-section`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_names, section_name: selectedSection }),
      });

      const data = await response.json();

      if (data.status) {
        // Add selected students to the section_name
        setStudentsWithSection((prev) => [
          ...prev,
          ...selectedStudents.map((student) => ({
            ...student,
            section_name: selectedSection,
          })),
        ]);

        // Remove the added students from the studentsWithoutSection list
        setStudentsWithoutSection((prev) =>
          prev.filter(
            (student) => !selectedStudents.some((selected) => selected.user_name === student.user_name)
          )
        );

        // Success message
        setMessage({ type: "success", text: "Students successfully added to the section." });
        setShowAddModal(false);
      } else {
        setMessage({ type: "error", text: "Failed to add students to the section." });
      }
    } catch (error) {
      console.error("Error adding students to section:", error);
      setMessage({ type: "error", text: "An error occurred while adding students to the section." });
    }
  };

  const handleAddSection = async (section_name) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/add-section`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ section_name, department: selectedDepartment }),
      });

      const data = await response.json();

      if (data.status) {
        console.log(`Section ${section_name} added successfully.`);
      } else {
        console.error("Failed to add section.");
      }
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const allStudents = [...studentsWithoutSection, ...studentsWithSection];
  const filteredStudentsWithSection = studentsWithSection.filter(
    (student) =>
      student.department === selectedDepartment &&
      student.section_name === selectedSection
  );

  // Filter students by status
const filteredByStatus = (students, status) => {
  switch (status) {
    case "Regular":
      // Filter students with assigned sections
      return students.filter(student => student.section_name !== null && student.section_name !== "");
    case "Irregular":
      // Placeholder logic: filter students with multiple sections (assuming studentsWithMultipleSections is available)
      return students.filter(student => student.sections && student.sections.length > 1); // Assuming "sections" is an array with multiple sections
    case "No Section":
      // Filter students without any section assigned
      return students.filter(student => student.section_name === null || student.section_name === "");
    default:
      return students;
  }
};

// Apply status filter first
const filteredStudentsByStatus = filteredByStatus(allStudents, selectedStatus);

// Then apply department and section filters
const filteredStudents = filteredStudentsByStatus.filter(
  (student) =>
    (selectedDepartment ? student.department === selectedDepartment : true) &&
    (selectedSection ? student.section_name === selectedSection : true)
);

// Function to clear all filters
const clearFilters = () => {
  setSelectedStatus("All");       // Reset status filter to "All"
  setSelectedDepartment(null);    // Reset department filter to null
  setSelectedSection(null);       // Reset section filter to null
};

  return (
    <div className={`container ${styles["scheduling-container"]}`}>
      {/* Dashboard Heading */}
      <div className="d-flex align-items-center mb-3">
        <button className="btn  me-3 back-button" style={{backgroundColor:"whitesmoke", cursor: "pointer"}} onClick={handleBack}>
          <FaArrowLeft style={{width:"1rem"}}/>
        </button>
        <h2 className={styles["dashboard-title"]} >
          Manage Section
        </h2>
        
      </div>


 {/* Department and Section Dropdowns */}
 <div className="d-flex align-items-center mb-4">
      <Form.Label className={`fs-5 me-3 ${styles["department-label"]}`}>
        Filters
      </Form.Label>
      
      {/* Status Dropdown */}
      <DropdownButton
        id="status-dropdown"
        title={selectedStatus || "Status"}
        onSelect={setSelectedStatus}
        className="me-3"
      >
        <Dropdown.Item eventKey="All">All</Dropdown.Item>
        <Dropdown.Item eventKey="Regular">Regular</Dropdown.Item>
        <Dropdown.Item eventKey="Irregular">Irregular</Dropdown.Item>
        <Dropdown.Item eventKey="No Section">No Section</Dropdown.Item>
      </DropdownButton>

      {/* Department Dropdown */}
      <DropdownButton
        id="department-dropdown"
        title={selectedDepartment || "Department"}
        onSelect={handleDepartmentChange}
        className={styles["department-dropdown"]}
      >
        {Object.keys(departmentSections).map((dept) => (
          <Dropdown.Item key={dept} eventKey={dept}>
            {dept}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      {/* Section Dropdown */}
      <DropdownButton
        id="section-dropdown"
        title={selectedSection || "Section"}
        onSelect={setSelectedSection}
        className={styles["department-dropdown"]}
        disabled={!selectedDepartment} // Disable section dropdown if no department is selected
      >
        {selectedDepartment && departmentSections[selectedDepartment]?.map((section_name) => (
          <Dropdown.Item key={section_name} eventKey={section_name}>
            {section_name}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      {/* Clear All Filters Button */}
      <Button
        variant="secondary"
        onClick={clearFilters}
        disabled={selectedStatus === "All" && !selectedDepartment && !selectedSection} // Disable if no filters are applied
        className={`ml-3 ${styles["close-icon"]}`}
        data-toggle="tooltip" data-placement="bottom" title="Clear all filters"
        style={{ display: (selectedStatus !== "All" || selectedDepartment || selectedSection) ? "inline-block" : "none" }} // Only show when filters are selected
      >
        <FaTimes />
      </Button>

      {/* Add Button */}
      <Button
        className={`${styles["add-button"]} ms-auto`}
        onClick={handleAddSection}
        // disabled={!selectedDepartment || !selectedSection}
      >
        + Add New Section
      </Button>
    </div>

    {/* Table */}
    <Table bordered className={styles["scheduling-table"]}>
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
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <tr key={student.user_name}>
              <td>{student.user_name}</td>
              <td>{student.section_name}</td>
              <td>{student.first_name}</td>
              <td>{student.last_name}</td>
              <td className="text-center">
                <FaPlus className={styles["plus-icon"]} 
                  onClick={() => handleAddButtonClick()} 
                />
                <FaTrashAlt
                  className={`${styles["delete-icon"]} ms-3`}
                  onClick={() => handleDeleteButtonClick(student)}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No students found for the selected filters.
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
                <tr key={student.user_name}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={student.isSelected}
                      onChange={() => handleStudentToggle(student.user_name)}
                    />
                  </td>
                  <td>{student.user_name}</td>
                  <td>
                    {student.first_name} {student.last_name}
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
