import React, { useEffect, useState } from "react";
import { DropdownButton, Dropdown, Button, Form, InputGroup } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import styles from "./Scheduling5.module.css";
import axios from "axios";  // Import axios for making API calls

const Filters = ({
  sections,   // Full list of sections
  selectedDepartment,
  selectedSection,
  selectedStatus,
  setSelectedStatus,
  handleDepartmentChange,
  setSelectedSection,
  clearFilters,
  filterTableData,  // New prop to pass the filtered data to the parent component or table
}) => {
  const [departments, setDepartments] = useState([]); // State for departments
  const [allSections, setAllSections] = useState([]);  // State for all sections (without filtering)
  const [filteredSections, setFilteredSections] = useState([]);  // State for filtered sections
  const [searchTerm, setSearchTerm] = useState("");  // Search term for filtering sections

  useEffect(() => {
    // Fetch all departments
    axios.get(`${process.env.REACT_APP_LOCALHOST}/api/departments`)
      .then(response => {
        if (response.data.status) {
          setDepartments(response.data.departments);  // Set the fetched departments
        } else {
          console.error("Failed to fetch departments:", response.data.message);
        }
      })
      .catch(error => {
        console.error("Error fetching departments:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch all sections when the department is selected or cleared
    if (selectedDepartment) {
      axios.get(`${process.env.REACT_APP_LOCALHOST}/api/sections?department=${selectedDepartment}`)
        .then(response => {
          if (response.data.status) {
            setAllSections(response.data.sections);  // Set all sections for a department
          } else {
            console.error("Failed to fetch sections:", response.data.message);
          }
        })
        .catch(error => {
          console.error("Error fetching sections:", error);
        });
    } else {
      // If no department selected, show all sections
      axios.get(`${process.env.REACT_APP_LOCALHOST}/api/sections`)
        .then(response => {
          if (response.data.status) {
            setAllSections(response.data.sections);  // Show all sections
          } else {
            console.error("Failed to fetch sections:", response.data.message);
          }
        })
        .catch(error => {
          console.error("Error fetching sections:", error);
        });
    }
  }, [selectedDepartment]); // Only refetch sections when selectedDepartment changes

  // Filter sections based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = allSections.filter(section =>
        section.section_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSections(filtered); // Set filtered sections based on search term
    } else {
      setFilteredSections(allSections); // Reset filter when searchTerm is cleared
    }
  }, [searchTerm, allSections]);  // Only run when searchTerm or allSections changes

  // Update table data based on selected section
  useEffect(() => {
    if (selectedSection) {
      // Assuming you have the logic to filter the table data based on selected section
      const filteredData = sections.filter(item => item.section_sched_id === selectedSection);
      filterTableData(filteredData);  // Pass filtered data to the parent or table
    }
  }, [selectedSection, sections, filterTableData]);

  const handleDepartmentSelect = (selectedDept) => {
    if (selectedDept === "All") {
      handleDepartmentChange("");  // Clear selected department
      setSelectedSection("");      // Clear selected section
    } else {
      handleDepartmentChange(selectedDept); // Set selected department
    }
  };

  return (
    <div className="d-flex align-items-center mb-4">
      <Form.Label className={`fs-5 me-3 ${styles["department-label"]}`}>
        Filters
      </Form.Label>

      {/* Status Dropdown */}
      <DropdownButton
        id="status-dropdown"
        title={selectedStatus || "Status"}
        onSelect={setSelectedStatus}  // Using the prop here
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
        onSelect={handleDepartmentSelect}  // Modified to handle "All" selection
        className={styles["department-dropdown"]}
      >
        <Dropdown.Item eventKey="All">All</Dropdown.Item> {/* Option to show all departments */}
        {departments.length > 0 ? (
          departments.map((dept, index) => (
            <Dropdown.Item key={index} eventKey={dept.department}>
              {dept.department}
            </Dropdown.Item>
          ))
        ) : (
          <Dropdown.Item disabled>No departments available</Dropdown.Item>
        )}
      </DropdownButton>

      {/* Section Dropdown */}
      <DropdownButton
        id="section-dropdown"
        title={selectedSection || "Section"}
        onSelect={setSelectedSection}
        className={styles["department-dropdown"]}
        disabled={!selectedDepartment && selectedDepartment !== "All"}
      >
        {/* Section Search Input */}
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search sections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term
          />
        </InputGroup>

        {selectedDepartment === "All" || selectedDepartment ? (
          filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <Dropdown.Item key={section.section_sched_id} eventKey={section.section_sched_id}>
                {section.section_name}
              </Dropdown.Item>
            ))
          ) : (
            <Dropdown.Item disabled>No sections available</Dropdown.Item>
          )
        ) : (
          <Dropdown.Item disabled>Select a department first</Dropdown.Item>
        )}
      </DropdownButton>

      {/* Clear Filters Button */}
      <Button
        variant="secondary"
        onClick={clearFilters}
        disabled={selectedStatus === "All" && !selectedDepartment && !selectedSection}
        className={`ms-3 ${styles["close-icon"]}`}
        data-toggle="tooltip"
        data-placement="bottom"
        title="Clear all filters"
        style={{
          display:
            selectedStatus !== "All" || selectedDepartment || selectedSection
              ? "inline-block"
              : "none",
        }}
      >
        <FaTimes />
      </Button>
    </div>
  );
};

export default Filters;
