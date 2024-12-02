import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import styles from "./Scheduling5.module.css";

// Import smaller components
import Filters from "./Filters";
import StudentTable from "./StudentTable";
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

  const [sections, setSections] = useState({});
  const [departments, setDepartments] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin/scheduling");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_LOCALHOST + "/admin/user-withWithoutSched");
        const data = await response.json();
        if (data.status) {
          setStudentsWithSection(data.results.withSchedule);
          setStudentsWithoutSection(data.results.withoutSchedule);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_LOCALHOST + "/admin/sections");
        const data = await response.json();
        if (data.status) {
          const sectionsByDepartment = data.results.reduce((acc, section) => {
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
    console.log("Department Changed:", department); // Debugging line
    setSelectedDepartment(department);
    setSelectedSection(null); // Reset section when department changes
  };

  const handleAddButtonClick = (student) => {
    setStudentToDelete(student);
  };

  const handleDeleteButtonClick = (student) => {
    setStudentToDelete(student);
  };

  const clearFilters = () => {
    setSelectedStatus("All");
    setSelectedDepartment(null);
    setSelectedSection(null);
  };

  // Debugging line: Check selected filters
  console.log("Selected Filters:", { selectedDepartment, selectedSection, selectedStatus });

  // Filter students based on selected filters
  const allStudents = [...studentsWithoutSection, ...studentsWithSection];
  const filteredStudents = allStudents.filter((student) => {
    const departmentMatch = selectedDepartment ? student.department === selectedDepartment : true;
    const sectionMatch = selectedSection ? student.section_name === selectedSection : true;
    const statusMatch =
      selectedStatus === "All" ||
      (selectedStatus === "Regular" && student.section_name) ||
      (selectedStatus === "Irregular" && !student.section_name) ||
      (selectedStatus === "No Section" && !student.section_name);

    return departmentMatch && sectionMatch && statusMatch;
  });

  // Debugging line: Check filteredStudents data
  console.log("Filtered Students:", filteredStudents);

  return (
    <div className={styles["scheduling-container"]}>
      {/* Dashboard Heading */}
      <div className="d-flex align-items-center mb-3">
        <button className="btn me-3 back-button" style={{ backgroundColor: "whitesmoke", cursor: "pointer" }} onClick={handleBack}>
          <FaArrowLeft style={{ width: "1rem" }} />
        </button>
        <h2 className={styles["dashboard-title"]}>Manage Section</h2>
      </div>

      {/* Filters Component */}
      <Filters
        sections={sections}
        selectedDepartment={selectedDepartment}
        selectedSection={selectedSection}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        handleDepartmentChange={handleDepartmentChange}
        setSelectedSection={setSelectedSection}
        clearFilters={clearFilters}
      />

      {/* Add New Section Button */}
      <Button
        className={`${styles["add-button"]} ms-auto`}
        data-toggle="modal"
        data-target="#addSectionModal"
      >
        + Add New Section
      </Button>

      {/* Add Section Modal */}
      <AddSection />

      {/* Students Table */}
      <StudentTable
        filteredStudents={filteredStudents}  // Pass filteredStudents here
        handleAddButtonClick={handleAddButtonClick}
        handleDeleteButtonClick={handleDeleteButtonClick}  // Pass the prop here
      />
    </div>
  );
}

export default Scheduling5;
