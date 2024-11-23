import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styles from './SchedSection.module.css';

const SelectSection = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get the selected department from location.state
    const { selectedDepartment } = location.state || {};

    const [selectedSection, setSelectedSection] = useState(null);
    const sections = ['1101', '1102', '1103'];

    console.log('Department:', selectedDepartment);

    const handleSectionClick = (section) => {
        if (selectedSection !== section) {
            console.log('Section clicked:', section);
            setSelectedSection(section);
            // Corrected the alert syntax
            alert(`Selected Section: ${section}`);
        }
    };

    const handleProceedClick = () => {
        if (selectedDepartment && selectedSection) {
            // Corrected the alert syntax
            alert(`Proceeding with Department: ${selectedDepartment}, Section: ${selectedSection}`);
            navigate('/admin/scheduling/calendar', {
                state: { selectedDepartment, selectedSection }
            });
        } else {
            alert('Please select a section');
        }
    };

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
            <div className="d-flex align-items-center mb-3">
                <span className={`${styles.backIcon} me-3`} onClick={handleBackClick}>&larr;</span>
                <h2 className={styles.selectSectionTitle}>Department: {selectedDepartment}</h2>
            </div>
            <h3 className={styles.selectSectionTitle}>Select Section</h3>
            <div className={`list-group ${styles.selectSectionList}`}>
                {sections.map((section, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`list-group-item list-group-item-action ${selectedSection === section ? 'active' : ''}`}
                        onClick={() => handleSectionClick(section)}
                    >
                        {section}
                    </button>
                ))}
            </div>
            <Button 
                variant="primary" 
                className={`${styles.proceedButton} mt-4 d-block mx-auto`} 
                onClick={handleProceedClick}
                disabled={!selectedSection}
            >
                PROCEED
            </Button>
        </div>
    );
};

export default SelectSection;
