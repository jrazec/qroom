import React, { useState, useEffect } from "react"; 
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
import AddSection from "./modals/AddSection";


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
  
  const [sections, setSections] = useState({});  // New state for sections
  const [studentsToAdd, setStudentsToAdd] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);


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

    const fetchSections = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/sections`);
        const data = await response.json();
        const { status, results } = data;
        if (status) {
          // Store sections grouped by department
          const sectionsByDepartment = results.reduce((acc, section) => {
            const dept = section.department;
            if (!acc[dept]) acc[dept] = [];
            acc[dept].push(section.name);
            return acc;
          }, {});
          setSections(sectionsByDepartment);  // Set the sections in state
        } else {
          console.error("Failed to fetch sections.");
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchData();
    fetchSections();  // Fetch sections data when component mounts
  }, []);

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    setSelectedSection(null); // Reset section_name
  };

  const handleAddButtonClick = (student) => {
    setStudentsToAdd([student]);
    // setShowAddModal(true);
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
    // setShowDeleteModal(true);
  };


  const clearFilters = () => {
    setSelectedStatus("All");
    setSelectedDepartment(null);
    setSelectedSection(null);
  };

  // Filter and display students
  const allStudents = [...studentsWithoutSection, ...studentsWithSection];
  const filteredStudents = allStudents.filter(
    (student) =>
      (selectedDepartment ? student.department === selectedDepartment : true) &&
      (selectedSection ? student.section_name === selectedSection : true)
  );

  return (
    <div className={`container ${styles["scheduling-container"]}`}>
      {/* Dashboard Heading */}
      <div className="d-flex align-items-center mb-3">
        <button className="btn  me-3 back-button" style={{ backgroundColor: "whitesmoke", cursor: "pointer" }} onClick={handleBack}>
          <FaArrowLeft style={{ width: "1rem" }} />
        </button>
        <h2 className={styles["dashboard-title"]}>Manage Section</h2>
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
          {Object.keys(sections).map((dept) => (
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
          disabled={!selectedDepartment}
        >
          {selectedDepartment && sections[selectedDepartment]?.map((section_name) => (
            <Dropdown.Item key={section_name} eventKey={section_name}>
              {section_name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        {/* Clear All Filters Button */}
        <Button
          variant="secondary"
          onClick={clearFilters}
          disabled={selectedStatus === "All" && !selectedDepartment && !selectedSection}
          className={`ml-3 ${styles["close-icon"]}`}
          data-toggle="tooltip" data-placement="bottom" title="Clear all filters"
          style={{ display: (selectedStatus !== "All" || selectedDepartment || selectedSection) ? "inline-block" : "none" }}
        >
          <FaTimes />
        </Button>

        {/* Add Button */}
        <Button
          className={`${styles["add-button"]} ms-auto`}
          data-toggle="modal"
          data-target="#addSectionModal"
        >
          + Add New Section
        </Button>
        {/* Add Account Modal */}
        <AddSection />
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
                <td>{student.section_name || "No Section"}</td>
                <td>{student.first_name}</td>
                <td>{student.last_name}</td>
                <td className="text-center">
                  <FaPlus
                    className={styles["plus-icon"]}
                    onClick={() => handleAddButtonClick(student)}
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
    </div>
  );
}

export default Scheduling5;
