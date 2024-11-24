import { useState, React, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS for modal functionality
import "./AddAccount.css";
import { getAccount, createAccount } from "../../api/api";

function AddAccount({data,groupAccounts,setData,setGroupAccounts}) {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Keep empty to show the placeholder



  const fetchData = async () =>{
    try {
      const fetchedData = await getAccount();
      setData(fetchedData);
      setGroupAccounts(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    fetchData(); // Call fetchData when the component mounts
  }, []); // }, [groupAccounts]); // This automatically renders. but infinitely loops 



  const clearInput = (e) => {
    e.preventDefault(); // Prevent default behavior of button
    setUserName('');
    setFirstName('');
    setMiddleName('');
    setLastName('');
    setPassword('');
    setRole(''); // Reset role to empty string to show the placeholder again
  };

  const sendUser = async (formData) => { // Sending the data from front to back
    const dataToSend = {
      userName: formData.get("userNameInput"),
      firstName: formData.get("firstNameInput"),
      middleName: formData.get("middleNameInput"),
      lastName: formData.get("lastNameInput"),
      role: formData.get("roleInput"),
      password: formData.get("passwordInput"),
    };

    await createAccount(dataToSend);
    await fetchData();
    setTimeout(() => {
      window.location.reload(); // Reload the page after deletion
    }, 500);
  }
  const validateInput = (formData) => {
    const fData = [ formData.get("userNameInput"),
                    formData.get("firstNameInput"),
                    formData.get("middleNameInput"),
                    formData.get("lastNameInput"),
                    formData.get("roleInput"),
                    formData.get("passwordInput")]

    for (const [index, data] of fData.entries()) {
      if (!data) { // Check if data is falsy (empty string, null, undefined, etc.)
          alert(`Please enter a valid value for ${["User Name", "First Name", "Middle Name", "Last Name", "Role", "Password"][index]}.`);
          return; // Return early if validation fails
      }
    }

    sendUser(formData);
    
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.target); // Get form data
    validateInput(formData); // Validate input data
  };


  return (
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
              data-dismiss="modal"   // Properly close the modal using Bootstrap
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-3">
            <form onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="mb-3">
                <label htmlFor="username">Username:</label>
                <input
                  name="userNameInput"
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
                  name="firstNameInput"
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder="Enter your value"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              {/* middle Name Field */}
              <div className="mb-3">
                <label htmlFor="middleName">Middle Name:</label>
                <input
                  name="middleNameInput"
                  type="text"
                  className="form-control"
                  id="middleName"
                  placeholder="Enter your value"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>

              {/* Last Name Field */}
              <div className="mb-3">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  name="lastNameInput"
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
                  name="passwordInput"
                  type="text"
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
                  name="roleInput"
                  className="form-select"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="" disabled>-- Choose Role --</option>
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              {/* Add and Cancel buttons */}
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={clearInput}>Clear</button>
                <button type="submit" className="btn btn-primary" formAction={validateInput}>Save</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );


}

export default AddAccount;
