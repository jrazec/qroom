import { useState, React } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS for modal functionality
import "./AddAccount.css";
import { cur } from "../../App";

function AddAccount() {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Keep empty to show the placeholder

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ userName, firstName, lastName, password, role });
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent default behavior of button
    setUserName('');
    setFirstName('');
    setLastName('');
    setPassword('');
    setRole(''); // Reset role to empty string to show the placeholder again
  };

  const withSelection = (
    <div
      className="modal fade bd-example-modal-lg"
      id="departmentSelectionModal"   // Add an ID to reference the modal
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Department Selection</h5>
            <button
              type="button"
              className="btn-close"
              data-dismiss="modal"  // Properly close the modal using Bootstrap
              aria-label="Close"
            >X</button>
          </div>
          <div className="modal-body p-3">
            <p>Choose a Department First</p>
          </div>
        </div>
      </div>
    </div>
  );

  const withoutSelection = (
    <div
      className="modal fade bd-example-modal-lg"
      id="addAccountModal"  // Add an ID to reference the modal
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Account</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"   // Properly close the modal using Bootstrap
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-3">
            <p>{cur.dept}</p>
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

              {/* Password Field */}
              <div className="mb-3">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your value"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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

              {/* Add and Cancel buttons */}
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">Add</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return (cur.dept === '' || cur.dept === undefined) ? withSelection : withoutSelection;
}

export default AddAccount;
