import React, { useState } from 'react';
import styles from './AssignProfessor.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useEffect } from 'react';

const AssignProfessor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const departments = ['CICS', 'CTE', 'CAS', 'CABE'];
  const [professors,setProfessors] = useState([
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
  ]);
  const [subjects,setSubjects] =useState([])

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredProfessors, setFilteredProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState({});
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showSubjectPopup, setShowSubjectPopup] = useState(false);
  const [isSubjectConfirmed, setIsSubjectConfirmed] = useState(false);
  const [showNoProfessorsWarning, setShowNoProfessorsWarning] = useState(false);

  useEffect(() => {
    console.log(location.state)
    if (location.state?.selectedDepartment) {
      setSelectedDepartment(location.state.selectedDepartment);
    }
    if (location.state?.selectedProfessor) {
      setSelectedProfessor(location.state.selectedProfessor);
    }
    if (location.state?.selectedSubject) {
      console.log(selectedProfessor,'ses')
      setSelectedSubject(location.state.selectedSubject);
    }
  }, [location.state]);
  
  
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

   // When the department changes (or when the page mounts), filter the professors
  //  useEffect(() => {
  //   if (selectedDepartment) {
  //     const filtered = professors.filter((prof) => prof.department === selectedDepartment);
  //     setFilteredProfessors(filtered);
  //     setShowNoProfessorsWarning(filtered.length === 0);
  //   }
  // }, [selectedDepartment, professors]); 

  useEffect(() => {
    if (selectedDepartment) {
      const filtered = professors.filter((prof) => prof.department === selectedDepartment);
      setFilteredProfessors(filtered);
      setShowNoProfessorsWarning(filtered.length === 0);
    }
  }, [selectedDepartment, professors]);
  


  

  const handleProfessorSelect = (professor) => {
    if (selectedProfessor?.user_name === professor.user_name) {
      setSelectedProfessor(null); // Deselect if already selected
      setFilteredProfessors((prev) =>
        prev.map((prof) =>
          prof.user_name === professor.user_name ? { ...prof, selectedSubject: null } : prof
        )
      );
      setShowSubjectPopup(false);
      setIsSubjectConfirmed(false); // Reset subject confirmation
    } else {
      setSelectedProfessor(professor); // Select new professor
      setFilteredProfessors((prev) =>
        prev.map((prof) =>
          prof.user_name === selectedProfessor?.user_name ? { ...prof, selectedSubject: null } : prof
        ).map((prof) =>
          prof.user_name === professor.user_name ? { ...prof, selectedSubject: null } : prof
        )
      );
      setSelectedSubject(null); // Reset subject selection on new professor
      setShowSubjectPopup(true);
      setIsSubjectConfirmed(false); // Reset subject confirmation
    }
  };

  const handleSubjectSelect = (subject) => {
    if (selectedSubject?.course_id === subject.course_id) {
      setSelectedSubject(null); // Deselect if already selected
    } else {
      console.log(subject)
      setSelectedSubject(subject); // Select new subject
    }
  };

  const handleChooseSubject = () => {
    if (selectedSubject) {
      setFilteredProfessors((prev) =>
        prev.map((prof) =>
          prof.user_name === selectedProfessor.user_name
            ? { ...prof, selectedSubject: selectedSubject.course_description }
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
        course_id: selectedSubject?.course_id,
      };
      console.log('Selected Professor and Subject:', userSectionSched);
      navigate('/admin/scheduling/sectionselect', { state: { selectedDepartment, selectedProfessor, selectedSubject, userSectionSched} });
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
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/admin/instructors-subjects`);
        const data = await response.json();
        const dProf = data.prof;
        const dSub = data.sub;
        setProfessors(dProf);
        setSubjects(dSub);
      } catch (error) {
        console.error('Error fetching professors:', error);
      }
    };

    fetchProfessors();
  }, []);
  

  console.log(filteredProfessors)

  
  return (
    <div className={`container ${styles.assignProfessorContainer}`}>
      <div className={`${styles.headerContainer} mt-4 d-flex align-items-center`}>
        <span className={styles.backIcon} onClick={handleBackClick}>
          &larr;
        </span>
        <h3 className={styles.dashboardHeader}>
          Schedule Class
        </h3>
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
        {showNoProfessorsWarning || !selectedProfessor && !selectedDepartment? (
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
          {subjects ? (
            subjects.map((subject) => (
              <div
                key={subject.course_id}
                onClick={() => handleSubjectSelect(subject)}
                className={`${styles.subjectRow} ${
                  selectedSubject?.course_id === subject.course_id ? styles.selectedRow : ''
                }`}
              >
                {subject.course_description}
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
