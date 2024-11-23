import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const SelectSection = () => {
    const [selectedSection, setSelectedSection] = useState(null);
    const sections = ['Section Names', 'Section Names', 'Section Names'];
    const navigate = useNavigate();

    const handleSectionClick = (section) => {
        setSelectedSection(section);
    };

    const handleProceedClick = () => {
        alert(`Proceed with section: ${selectedSection}`);
        // You can navigate to the next page here if needed
        // navigate('/next-page');
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Select Section</h2>
            <div className="list-group">
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
                className="mt-4 d-block mx-auto" 
                onClick={handleProceedClick}
                disabled={!selectedSection}
            >
                PROCEED
            </Button>
        </div>
    );
};

export default SelectSection;
