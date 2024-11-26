import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styles from './SchedSection.module.css';

const SelectSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get selected department from the previous page
  const { selectedDepartment, userSectionSched } = location.state || {};

  const [selectedSection, setSelectedSection] = useState(null);

  // Updated sections array with department and sections as objects
  const sections = [
    { department: "CICS", section: ['BSIT 1101', 'BSIT 1102', 'BSIT 1103', 'BSIT 1104', 'BSIT 1105', 'BSIT 1106', 'BSIT 1107', 'BSIT 1108', 'BSIT 1109', 'BSIT 2101', 'BSIT 2102', 'BSIT 2103', 'BSIT 2104', 'BSIT 2105', 'BSIT BA 3101', 'BSIT BA 3102', 'BSIT NT 3101', 'BSIT SM 3101', 'BSIT SM 3102', 'BSIT BA 4101', 'BSIT BA 4102', 'BSIT NT 4101', 'BSIT NT 4102', 'BSIT SM 4101'] },
    { department: "CTE", section: ['BSED 101', 'BSHRM 102', 'BSHRM 103'] },
    { department: "CAS", section: ['BSChem 101', 'BSPsych 102', 'BSCrim 201'] },
    { department: "CABE", section: ['BECE 1001', 'BEEE 1002', 'BME 1003'] }
  ];

  // Filter sections based on the selected department
  const filteredSections = sections.find(item => item.department === selectedDepartment)?.section || [];

  console.log('Department: ', { selectedDepartment });

  // Handle section selection
  const handleSectionClick = (section) => {
    if (selectedSection !== section) {
      console.log('Section clicked:', section);
      setSelectedSection(section);
      alert('Selected Section: ' + section);
    }
  };

  // Proceed to the next page with selected section and department
  const handleProceedClick = () => {
    if (selectedDepartment && selectedSection) {
      alert('Proceeding with ' + selectedDepartment + ' - ' + selectedSection);
      navigate('/admin/scheduling/calendar', {
        state: { selectedDepartment, selectedSection, userSectionSched },
      });
    } else {
      alert('Please select a section');
    }
  };

  // Handle the back button click
  const handleBackClick = () => {
    if (selectedSection) {
      if (window.confirm('You have already selected a section. Are you sure you want to go back?')) {
        console.log('Back confirmed with section selected:', selectedSection);
        navigate('/admin/scheduling/profselect');
      } else {
        console.log('Back cancelled by user');
      }
    } else {
      console.log('Back clicked with no section selected');
      navigate('/admin/scheduling/profselect');
    }
  };

  return (
    <div className={`${styles.selectSectionContainer} container mt-4`}>
      <div className={`${styles.headerContainer} mt-4 d-flex align-items-center`}>
        <span className={styles.backIcon} onClick={handleBackClick}>
          &larr;
        </span>
        <h2 className={styles.dashboardHeader}>Schedule Class</h2>
      </div>
      <h3 className={styles.selectSectionTitle}>Select Section</h3>
      <div className={`list-group ${styles.selectSectionList}`}>
        {/* Map over filtered sections based on the selected department */}
        {filteredSections.length > 0 ? (
          filteredSections.map((section, index) => (
            <button
              key={index}
              type="button"
              className={`list-group-item list-group-item-action ${selectedSection === section ? 'active' : ''}`}
              onClick={() => handleSectionClick(section)}
              style={{
                backgroundColor: selectedSection === section ? '#800000' : '',
                color: selectedSection === section ? '#ffffff' : '',
                borderColor: selectedSection === section ? '#800000' : '',
              }}
            >
              {section}
            </button>
          ))
        ) : (
          <div className="alert alert-warning">No sections available for this department.</div>
        )}
      </div>
      <div className="d-flex justify-content-end">
        <Button
          variant="primary"
          className={`${styles.proceedButton} mt-4`}
          onClick={handleProceedClick}
          disabled={!selectedSection}
        >
          PROCEED
        </Button>
      </div>
    </div>
  );
};

export default SelectSection;
