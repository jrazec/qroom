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
  const [studentsWithoutSection, setStudentsWithoutSection] = useState([]);
  const [studentsWithSection, setStudentsWithSection] = useState([]);
  const [sections, setSections] = useState({});
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
          const sectionsByDepartment = results.reduce((acc, section) => {
            const dept = section.department;
            if (!acc[dept]) acc[dept] = [];
            acc[dept].push(section.name);
            return acc;
          }, {});
          setSections(sectionsByDepartment);
        } else {
          console.error("Failed to fetch sections.");
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchData();
    fetchSections();
  }, []);

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    setSelectedSection(null); // Reset section_name
  };

  const handleAddButtonClick = (student) => {
    setStudentsToAdd([student]);
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
  };

  const clearFilters = () => {
    setSelectedStatus("All");
    setSelectedDepartment(null);
    setSelectedSection(null);
  };

  // Check if a student is irregular, regular, or has no section
  const getStudentStatus = (student) => {
    // Assuming studentsWithSection already has section info
    const sectionCount = student.section_name ? 1 : 0; // Counting sections
    if (sectionCount > 1) {
      return "Irregular";  // More than one section
    } else if (sectionCount === 1) {
      return "Regular";  // Exactly one section
    } else {
      return "No Section";  // No section
    }
  };

  // Filter and display students based on selected filters
  const allStudents = [
    ...studentsWithoutSection.map(student => ({ ...student, section_name: null })),
    ...studentsWithSection
  ];

  const filteredStudents = allStudents.filter((student) => {
    const status = getStudentStatus(student);

    // Apply filters based on department, section, and status
    return (
      (selectedDepartment ? student.department === selectedDepartment : true) &&
      (selectedSection ? student.section_name === selectedSection : true) &&
      (selectedStatus === "All" || status === selectedStatus)
    );
  });

  return (
    <div className={`container ${styles["scheduling-container"]}`}>
      {/* Dashboard Heading */}
      <div className="d-flex align-items-center mb-3">
        <button className="btn me-3 back-button" style={{ backgroundColor: "whitesmoke", cursor: "pointer" }} onClick={handleBack}>
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
