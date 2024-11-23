import React, { useState } from 'react';
import styles from './AssignProfessor.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const AssignProfessor = () => {
  const navigate = useNavigate();

  const departments = ['CICS', 'CTE', 'CAS', 'CABE'];
  const professors = [
    { user_name: 'prof001', department: 'CICS', name: 'Dr. John Smith', subjects: [{ id: 1, course_name: 'DSA' }, { id: 2, course_name: 'Linear Algebra' }, { id: 4, course_name: 'Calculus' }, { id: 5, course_name: 'ssssss' }, { id: 3, course_name: 'Calculus' }] },
  { user_name: 'prof002', department: 'CICS', name: 'Dr. Jane Doe', subjects: [] },
  { user_name: 'prof003', department: 'CTE', name: 'Prof. Michael White', subjects: [{ id: 1, course_name: 'Physics' }] },
  { user_name: 'prof004', department: 'CAS', name: 'Prof. Sarah Black', subjects: [{ id: 2, course_name: 'Chemistry' }] },
  { user_name: 'prof005', department: 'CICS', name: 'Dr. John Smith', subjects: [{ id: 3, course_name: 'Calculus' }] },
  { user_name: 'prof006', department: 'CICS', name: 'Dr. John Smith', subjects: [] },
  { user_name: 'prof007', department: 'CICS', name: 'Dr. John Smith', subjects: [{ id: 4, course_name: 'Advanced Mathematics' }] },
  { user_name: 'prof008', department: 'CTE', name: 'Prof. Alex Green', subjects: [{ id: 5, course_name: 'Introduction to Education' }] },
  { user_name: 'prof009', department: 'CAS', name: 'Dr. Emma Blue', subjects: [{ id: 6, course_name: 'Organic Chemistry' }, { id: 7, course_name: 'Biology' }] },
  { user_name: 'prof010', department: 'CABE', name: 'Prof. Alan Gray', subjects: [{ id: 8, course_name: 'Engineering Mechanics' }] },
  ];

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showSubjectPopup, setShowSubjectPopup] = useState(false);
  const [isSubjectConfirmed, setIsSubjectConfirmed] = useState(false);
  const [showNoProfessorsWarning, setShowNoProfessorsWarning] = useState(false);

  const handleDepartmentChange = (e) => {
    const department = e.target.value;
    setSelectedDepartment(department);
    const filtered = professors.filter((prof) => prof.department === department);
    setFilteredProfessors(filtered);
    setSelectedProfessor(null); // Reset selection when changing department
    setSelectedSubject(null);
    setShowNoProfessorsWarning(filtered.length === 0);
    setIsSubjectConfirmed(false); // Reset confirmation on department change
  };

  const handleProfessorSelect = (professor) => {
    if (selectedProfessor?.user_name === professor.user_name) {
      setSelectedProfessor(null); // Deselect if already selected
      setShowSubjectPopup(false);
      setIsSubjectConfirmed(false); // Reset subject confirmation
    } else {
      setSelectedProfessor(professor); // Select new professor
      setSelectedSubject(null); // Reset subject selection on new professor
      setShowSubjectPopup(true);
      setIsSubjectConfirmed(false); // Reset subject confirmation
    }
  };

  const handleSubjectSelect = (subject) => {
    if (selectedSubject?.id === subject.id) {
      setSelectedSubject(null); // Deselect if already selected
    } else {
      setSelectedSubject(subject); // Select new subject
    }
  };

  const handleChooseSubject = () => {
    if (selectedSubject) {
      setFilteredProfessors((prev) =>
        prev.map((prof) =>
          prof.user_name === selectedProfessor.user_name
            ? { ...prof, selectedSubject: selectedSubject.course_name }
            : prof
        )
      );
      setShowSubjectPopup(false);
      setIsSubjectConfirmed(true); // Mark subject as confirmed
    } else {
      alert('Please choose a subject before proceeding.');
    }
  };

  const handleProceed = () => {
    if (!selectedProfessor || !selectedSubject) {
      alert('Please choose a professor and subject before proceeding.');
    } else {
      const userSectionSched = {
        user_name: selectedProfessor.user_name,
        subject_id: selectedSubject?.id,
      };
      console.log('Selected Professor and Subject:', userSectionSched);
      navigate('/admin/scheduling/sectionselect', { state: { selectedDepartment } });
    }
  };

  const handleBackClick = () => {
    if (selectedDepartment || selectedProfessor || selectedSubject) {
      const confirmBack = window.confirm('You have already made a selection. Are you sure you want to go back?');
      if (confirmBack) {
        navigate('/admin/scheduling/');
      }
    } else {
      navigate('/admin/scheduling/');
    }
  };

  return (
    <div className={`container ${styles.assignProfessorContainer}`}>
      <div className={`${styles.headerContainer} mt-4 d-flex align-items-center`}>
        <span className={styles.backIcon} onClick={handleBackClick}>
          &larr;
        </span>
        <h1 className={styles.dashboardHeader}>
          Department <span className={styles.subHeader}>Scheduling</span>
        </h1>
      </div>

      <div className={`mt-4 ${styles.departmentSelect}`}>
        <label htmlFor="departmentSelect" className={`form-label ${styles.label}`}>
          Select Department
        </label>
        <select
          id="departmentSelect"
          className={`form-select ${styles.departmentDropdown}`}
          value={selectedDepartment}
          onChange={handleDepartmentChange}
        >
          <option value="" disabled>
            Choose Department
          </option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className={`mt-4 ${styles.assignProfessor}`}>
        <h3 className={styles.sectionHeader}>Assign Professor</h3>
        {showNoProfessorsWarning ? (
          <div className={`alert alert-warning ${styles.noProfessorsWarning}`}>
            No instructors added. Please choose another department or add a professor to the department.
          </div>
        ) : (
          <div className={styles.professorList}>
            {filteredProfessors.map((prof) => (
              <div
                key={prof.user_name}
                onClick={() => handleProfessorSelect(prof)}
                className={`${styles.professorRow} ${
                  selectedProfessor?.user_name === prof.user_name ? styles.selectedRow : ''
                }`}
              >
                <div className={`${styles.professorCell} ${styles.professorId}`} style={{ width: '30%' }}>
                  {prof.user_name}
                </div>
                <div className={`${styles.professorCell} ${styles.professorName}`} style={{ width: '35%' }}>
                  {prof.name}
                </div>
                <div className={`${styles.professorCell} ${styles.professorSubject}`} style={{ width: '35%' }}>
                  {prof.selectedSubject ? `Subject: ${prof.selectedSubject}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showSubjectPopup && (
        <div
          className={styles.subjectPopup}
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            width: '300px',
            height: '250px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '10px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          <h5>Select Subject</h5>
          {selectedProfessor?.subjects.length > 0 ? (
            selectedProfessor.subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => handleSubjectSelect(subject)}
                className={`${styles.subjectRow} ${
                  selectedSubject?.id === subject.id ? styles.selectedRow : ''
                }`}
              >
                {subject.course_name}
              </div>
            ))
          ) : (
            <div className={`alert alert-warning ${styles.noSubjectsWarning}`}>
              Go back to the scheduling and assign subjects to the professor first.
            </div>
          )}
          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={() => setShowSubjectPopup(false)}>
              Close
            </Button>
            <Button variant="primary" className={styles.proceedButton}onClick={handleChooseSubject} disabled={!selectedSubject}>
              Choose
            </Button>
          </div>
        </div>
      )}

      <div className={`d-flex justify-content-end`}>
        <Button
          variant="danger"
          className={`mt-4 ${styles.proceedButton}`}
          onClick={handleProceed}
          disabled={!selectedProfessor || !selectedSubject || !isSubjectConfirmed}
        >
          PROCEED
        </Button>
      </div>
    </div>
  );
};

export default AssignProfessor;
