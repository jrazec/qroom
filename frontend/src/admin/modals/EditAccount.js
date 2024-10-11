import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS for modal functionality
import "./AddAccount.css";  // Reuse AddAccount.css for consistent styling
import { cur } from "../../App"; // Assuming you need this for department selection

function EditAccount({ existingData, closeEditModal }) {
  const [userName, setUserName] = useState(existingData.user_name || '');
  const [firstName, setFirstName] = useState(existingData.first_name || '');
  const [lastName, setLastName] = useState(existingData.last_name || '');
  const [middleName, setMiddleName] = useState(existingData.middle_name || '');
  const [password, setPassword] = useState(existingData.password || '');
  const [role, setRole] = useState(existingData.role || '');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ userName, firstName, lastName, password, role });
    // Logic to save changes goes here
    closeEditModal(); // Close modal after saving changes
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
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="mb-3">
                <label htmlFor="username">Username:</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
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
                  id="firstName"
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
                  id="lastName"
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
                  id="middleName"
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
                  id="password"
                  placeholder="Enter your value"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="showPassword"
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
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>-- Choose Role --</option>
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
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
