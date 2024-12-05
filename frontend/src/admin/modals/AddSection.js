import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS for modal functionality
import "./AddAccount.css";
import { createSection, getSection } from "../../api/api";

function AddSection({setData, setGroupSections}) {
  const [sectionName, setSectionName] = useState('');
  const [programName, setProgramName] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');

  // Fetch section data
  const fetchData = async () => {
    try {
      const fetchedData = await getSection();
      setData(fetchedData);
      setGroupSections(fetchedData);
    } catch (error) {
      console.error('Error fetching section data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []);

  // Clear input fields
  const clearInput = (e) => {
    e.preventDefault(); // Prevent default behavior of button
    setSectionName('');
    setProgramName('');
    setStartMonth('');
    setEndMonth('');
  };

  // Send the section data to the backend
  const sendSection = async (formData) => {
    const dataToSend = {
      sectionName: formData.get("sectionNameInput"),
      programName: formData.get("programNameInput"),
      startMonth: formData.get("startMonthInput"),
      endMonth: formData.get("endMonthInput")
    };

    await createSection(dataToSend);
    await fetchData();
    window.location.reload(); // Reload the page after adding a section

  };

  // Validate input fields
  const validateInput = (formData) => {
    const fData = [formData.get("sectionNameInput"), formData.get("programNameInput"), formData.get("startMonthInput"), formData.get("endMonthInput")]

    for (const [index, data] of fData.entries()) {
      if (!data) {
        alert(`Please enter a valid value for ${["Department", "Section", "Program", "Start Month", "End Month" ][index]}.`);
        return; // Return early if validation fails
      }
    }

    sendSection(formData); // If validation passes, send the section data
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.target); // Get form data
    validateInput(formData); // Validate input data
  };

  return (
    <div
      className="modal fade bd-example-modal-lg"
      id="addSectionModal" // Updated modal ID for section
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Section</h5>
            <button
              type="button"
              className="btn-close"
              data-dismiss="modal" // Properly close the modal using Bootstrap
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-3">
            <form onSubmit={handleSubmit}>
              {/* Section name Field */}
              <div className="mb-3">
                <label htmlFor="sectionName">Section:</label>
                <input
                  name="sectionNameInput"
                  type="text"
                  className="form-control"
                  id="sectionName"
                  placeholder="Enter Section Name"
                  value={sectionName}
                  onChange={(e) => setSectionName(e.target.value)}
                />
              </div>

              {/* Section name Field */}
              <div className="mb-3">
                <label htmlFor="programName">Program:</label>
                <input
                  name="programNameInput"
                  type="text"
                  className="form-control"
                  id="programName"
                  placeholder="Enter Program Name"
                  value={programName}
                  onChange={(e) => setProgramName(e.target.value)}
                />
              </div>
              {/* Start Month Field */}
              <div className="mb-3">
              <label htmlFor="startMonth">Start Month:</label>
              <input
                name="startMonthInput"
                type="date"
                className="form-control"
                id="startMonth"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />
            </div>

            {/* End Month Field */}
            <div className="mb-3">
              <label htmlFor="endMonth">End Month:</label>
              <input
                name="endMonthInput"
                type="date"
                className="form-control"
                id="endMonth"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
              />
            </div>

              {/* Add and Cancel buttons */}
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={clearInput}>Clear</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSection;
