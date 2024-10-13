import { useState, React, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS for modal functionality
import "./AddAccount.css";  // Reuse AddAccount.css for consistent styling
import { updateData,fetchGroupAccounts } from "../api/api";
import { DataContext } from "../Accounts";


function EditAccount({ existingData, closeEditModal }) {
  const [userName, setUserName] = useState(existingData.user_name || '');
  const [firstName, setFirstName] = useState(existingData.first_name || '');
  const [lastName, setLastName] = useState(existingData.last_name || '');
  const [middleName, setMiddleName] = useState(existingData.middle_name || '');
  const [password, setPassword] = useState(existingData.password || '');
  const [role, setRole] = useState(existingData.role || '');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [ data, setData, groupAccounts, setGroupAccounts ] = useContext(DataContext);

  const fetchData = async () =>{
    try {
      const fetchedData = await fetchGroupAccounts();
      setData(fetchedData);
      setGroupAccounts(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []); // }, [groupAccounts]); // This automatically renders. but infinitely loops 

  const updateUser = async (formData) => { // Sending the data from front to back
    const dataToSend = {
      newUserName: formData.get("editAccountUserNameInput"),
      firstName: formData.get("editAccountFirstNameInput"),
      middleName: formData.get("editAccountMiddleNameInput"),
      lastName: formData.get("editAccountLastNameInput"),
      role: formData.get("editAccountRoleInput"),
      password: formData.get("editAccountPasswordInput"),
      userName: formData.get("editAccountUserNameInput")
    };

    await updateData(dataToSend);
    await fetchData();
  }

  const validateInput = (formData) => {
    const fData = [ formData.get("editAccountUserNameInput"), // newUserNameInput
                    formData.get("editAccountFirstNameInput"),
                    formData.get("editAccountMiddleNameInput"),
                    formData.get("editAccountLastNameInput"),
                    formData.get("editAccountRoleInput"),
                    formData.get("editAccountPasswordInput")]

    for (const [index, data] of fData.entries()) {
      if (!data) { // Check if data is falsy (empty string, null, undefined, etc.)
          alert(`Please enter a valid value for ${["User Name", "First Name", "Middle Name", "Last Name", "Role", "Password"][index]}. ${data}`);
          return; // Return early if validation fails
      }
    }

    updateUser(formData);
    
  }



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ userName, firstName, lastName, password, role });
    const formData = new FormData(e.target); // Get form data
    validateInput(formData); // Validate input data
    closeEditModal(); // Close modal after saving changes
    window.location.reload();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle between showing and hiding the password
  };

  return (
    <div
      className="modal fade show"
      style={{ display: 'block' }} // Ensure the modal is displayed
      tabIndex="-1"
      role="dialog"
      aria-labelledby="editAccountModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Account</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeEditModal} // Close modal on button click
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-3">
            <form id="editAccount" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="mb-3">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  name="editAccountUserNameInput"
                  placeholder="Enter your value"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              {/* First Name Field */}
              <div className="mb-3">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="editAccountFirstNameInput"
                  placeholder="Enter your value"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* Last Name Field */}
              <div className="mb-3">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="editAccountLastNameInput"
                  placeholder="Enter your value"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              {/* Middle Name Field */}
              <div className="mb-3">
                <label htmlFor="middleName">Middle Name:</label>
                <input
                  type="text"
                  className="form-control"
                  name="editAccountMiddleNameInput"
                  placeholder="Enter your value"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password">Password:</label>
                <input
                  type={showPassword ? "text" : "password"} // Show password based on toggle
                  className="form-control"
                  name="editAccountPasswordInput"
                  placeholder="Enter your value"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="editAccountShowPasswordInput"
                    checked={showPassword}
                    onChange={togglePasswordVisibility}
                  />
                  <label className="form-check-label" htmlFor="showPassword">
                    Show Password
                  </label>
                </div>
              </div>

              {/* Role Field */}
              <div className="mb-3">
                <label htmlFor="role">Role:</label>
                <select
                  className="form-select"
                  name="editAccountRoleInput"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>-- Choose Role --</option>
                  <option value="Student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              {/* Save and Cancel buttons */}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" onClick={closeEditModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditAccount;
