import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import styles from './SchedSection.module.css';

const SelectSection = () => {
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedSectionDetails, setSelectedSectionDetails] = useState({});
    const sections = ['Section A', 'Section B', 'Section C'];
    const navigate = useNavigate();
    const location = useLocation();
    const { selectedDepartment } = location.state || { selectedDepartment: '' };

    const handleSectionClick = (section) => {
        if (selectedSection !== section) {
            console.log('Section clicked:', section);
            setSelectedSection(section);
            setSelectedSectionDetails({ sectionName: section });
            console.log('Selected Section Details updated:', { sectionName: section });
        }
    };

    const handleProceedClick = () => {
        alert(`Proceed with section: ${selectedSection}`);
        console.log('Proceed clicked. Selected Section Details:', selectedSectionDetails);
        // You can navigate to the next page here if needed
        navigate('/admin/scheduling/calendar');
    };

    const handleBackClick = () => {
        if (selectedSection) {
            if (window.confirm('You have already selected a section. Are you sure you want to go back?')) {
                console.log('Back confirmed with section selected:', selectedSection);
                // Placeholder for navigation to the previous page
                navigate('/admin/scheduling/profselect');
            } else {
                console.log('Back cancelled by user');
            }
        } else {
            console.log('Back clicked with no section selected');
            // Placeholder for navigation to the previous page
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
