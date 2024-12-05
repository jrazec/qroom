import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { FaPlus, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import styles from "./Scheduling5.module.css";

const StudentTable = ({ filteredStudents, handleAddButtonClick, handleDeleteButtonClick }) => {
  const [showModal, setShowModal] = useState(false); // Modal visibility for adding schedules
  const [sections, setSections] = useState([]); // All sections data
  const [selectedSections, setSelectedSections] = useState([]); // Selected sections for the user
  const [selectedStudent, setSelectedStudent] = useState(null); // The student being edited
  const [studentType, setStudentType] = useState("regular"); // Regular or irregular student type
  const [showSectionModal, setShowSectionModal] = useState(false); // Modal visibility for adding a section
  const [selectedSection, setSelectedSection] = useState(null); // The section selected to assign
  const [schedS, setSchedS] = useState([]); // The section selected to assign
  // Fetch available sections once the component mounts
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get("/api/sections");
        console.log("Fetched Sections:", response.data); // Log the response data
        if (response.data && response.data.status && Array.isArray(response.data.sections)) {
          setSchedS(response.data.sec_sched);
          setSections(response.data.sections); // Set sections in state if the structure is correct
        } else {
          console.error("Invalid response structure or empty sections");
          setSections([]);  // Set an empty array if data is invalid
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
        setSections([]); // Fallback to empty array in case of an error
      }
    };
    fetchSections();
  }, []);

  const handleAddSchedules = async () => {
    if (!selectedStudent || !selectedStudent.user_name) {
      alert("Student user name is not set!");
      return;
    }

    let sectionSchedIds = [];

    // If student is regular, try to fetch schedules for their section
    if (studentType === "regular") {
     
        try {
          const response = await axios.get(`${process.env.REACT_APP_LOCALHOST}/api/get-section-schedules/${selectedSection}`);
          // Forcefully add schedule IDs if no section schedules found

            sectionSchedIds = response.data.schedules.map(s => s.section_sched_id);
            console.log(sectionSchedIds)

        } catch (error) {
          console.log("Error fetching section schedules:", error);
          console.log("Error fetching section schedules. Proceeding with default schedules.");
          sectionSchedIds = [1, 2, 3]; // Fallback brute force
        }

        const payload = {
          userName: selectedStudent.user_name,
          sectionSchedIds: sectionSchedIds,
        };

        const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/add-schedules-for-irregular`, payload);
        if (response.data.status) {
          alert("Schedules added successfully!");
          setShowModal(false); // Close the modal after successful addition
        } else {

        }

      if (sectionSchedIds.length === 0) {
        alert("No section schedules found for this student.");
        return;
      }

      try {
        const payload = {
          userName: selectedStudent.user_name,
          sectionSchedIds: sectionSchedIds,
        };

        const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}api/add-schedules-for-regular`, payload);
        if (response.data.status) {
          alert("Schedules added successfully!");
          setShowModal(false); // Close the modal after successful addition
        } else {
          console.log("Failed to add schedules.");
        }
      } catch (error) {
        console.log("Error adding schedules:", error);

      }
    } else if (studentType === "irregular") {
      if (selectedSections.length === 0) {
        alert("Please select at least one section.");
        return;
      }

      try {
        const payload = {
          userName: selectedStudent.user_name,
          sectionSchedIds: selectedSections,
        };

        const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/add-schedules-for-irregular`, payload);
        if (response.data.status) {
          alert("Schedules added successfully!");
          setShowModal(false); // Close the modal after successful addition
        } else {
          console.log("Failed to add schedules.");
        }
      } catch (error) {
        console.log("Error adding schedules:", error);

      }
    }
    window.location.reload();
  };

  const handleDeleteSchedules = async (student) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/delete-schedules`, {
        userName: student.user_name,
      });

      if (response.data.status) {
        alert("Schedules removed successfully!");
      } else {
        alert(response.data.message || "Failed to remove schedules.");
      }
    } catch (error) {
      console.log("Error removing schedules:", error.response ? error.response.data : error.message);
    
    }
    window.location.reload();
  };

  const handleAddSection = async (student) => {
    setSelectedStudent(student); // Set the selected student for whom we will add a section
    setShowSectionModal(true); // Show the modal for adding a section
  };

  return (
    <>
      <Table bordered className={styles["scheduling-table"]} style={{maxHeight:"600px",overflowY:"auto"}}>
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
                    onClick={() => {
                      setSelectedStudent(student); // Set the student for whom schedules will be added
                      setSelectedSections([]); // Clear previously selected sections
                      setStudentType("regular"); // Set the student type (regular/irregular)
                      setShowModal(true); // Show the modal for adding sections
                    }}
                  />
                  <FaTrashAlt
                    className={`${styles["delete-icon"]} ms-3`}
                    onClick={() => handleDeleteSchedules(student)} // Call the handleDeleteSchedules method
                  />
                  {/* <FaPlus
                    className={styles["add-section-icon"]} // Add a new icon for adding a section
                    onClick={() => handleAddSection(student)} // Call the new handler for adding a section
                  /> */}
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

    
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {studentType === "regular" ? "Add Schedule for Regular Student" : "Select Sections for Irregular Student"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
          <div className="d-flex justify-content-center mb-3">
            <Button
              variant={studentType === "regular" ? "primary" : "outline-primary"}
              onClick={() => setStudentType("regular")}
              className="me-2"
            >
              Regular
            </Button>
            <Button
              variant={studentType === "irregular" ? "primary" : "outline-primary"}
              onClick={() => setStudentType("irregular")}
            >
              Irregular
            </Button>
          </div>
          {studentType === "regular" ? (
            <>
              <h5>Select Section</h5>
              <Form>
                {sections.length > 0 ? (
                  sections.map((section) => (
                    <Form.Check
                      key={section.section_name}
                      type="radio"
                      label={section.section_name}
                      name="sectionRadio"
                      value={section.section_name}
                      checked={selectedSection === section.section_name}
                      onChange={(e) => setSelectedSection(e.target.value)}
                    />
                  ))
                ) : (
                  <p>Loading sections...</p>
                )}
              </Form>
            </>
          ) : (
            <>
              <h5>Select Subjects to Add</h5>
              <Form>
                {schedS.length > 0 ? (
                  schedS.map((section) => (
                    <Form.Check
                      key={section.section_sched_id}
                      type="checkbox"
                      label={`${section.section_sched_id} - ${section.course_description} (${section.section_name}) | ${section.name} | ${section.day} - ${section.time_start} to ${section.time_end}`}
                      value={section.section_sched_id}
                      checked={selectedSections.includes(section.section_sched_id)}
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        const sectionSchedId = parseInt(value);

                        setSelectedSections((prevSections) => {
                          let newSections = [...prevSections];

                          if (checked) {
                            if (!newSections.includes(sectionSchedId)) {
                              newSections.push(sectionSchedId);
                            }
                          } else {
                            newSections = newSections.filter(id => id !== sectionSchedId);
                          }

                          return newSections;
                        });
                      }}
                    />
                  ))
                ) : (
                  <p>Loading sections...</p>
                )}
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSchedules}>
            Add Schedule
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showSectionModal} onHide={() => setShowSectionModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add Section to {selectedStudent?.first_name} {selectedStudent?.last_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "600px", overflowY: "auto" }}>
        Add Section to {selectedStudent?.first_name} {selectedStudent?.last_name}
          {schedS.length > 0 ? (
            schedS.map((section) => (
              <Form.Check
                key={section.section_sched_id}
                type="checkbox" // Using checkbox to allow multiple selection
                label={section.section_name}
                value={section.section_sched_id}
                checked={selectedSections.includes(section.section_sched_id)} // Ensure the checkbox is checked
                onChange={(e) => {
                  const { value, checked } = e.target;
                  const sectionSchedId = parseInt(value);

                  // Add or remove section from selectedSections array
                  if (checked && !selectedSections.includes(sectionSchedId)) {
                    setSelectedSections([...selectedSections, sectionSchedId]);
                  } else {
                    setSelectedSections(selectedSections.filter(id => id !== sectionSchedId));
                  }
                }}
              />
            ))
          ) : (
            <p>Loading sections...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSectionModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={async () => {
              if (selectedSections.length > 0) {
                try {
                  const response = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/add-sections-to-student`, {
                    userName: selectedStudent.user_name,
                    sectionSchedIds: selectedSections,
                  });
                  if (response.data.status) {
                    alert("Sections added successfully!");
                    setShowSectionModal(false);
                  } else {
                    console.log("Failed to add sections.");
                  }
                } catch (error) {
                  console.log("Error adding sections:", error);
                  console.log("Error adding sections.");
                }
              } else {
                console.log("Please select at least one section.");
              }
            }}
          >
            Add Sections
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default StudentTable;
