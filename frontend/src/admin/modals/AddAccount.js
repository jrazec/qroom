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
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');


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
    setDepartment('');
    setEmail('');
  };

  const sendUser = async (formData) => { // Sending the data from front to back
    const dataToSend = {
      userName: formData.get("userNameInput"),
      firstName: formData.get("firstNameInput"),
      middleName: formData.get("middleNameInput"),
      lastName: formData.get("lastNameInput"),
      role: formData.get("roleInput"),
      password: formData.get("passwordInput"),
      department: formData.get("departmentInput"),
      email: formData.get("emailInput")
    };

    await createAccount(dataToSend);
    await fetchData();

    window.location.reload(); // Reload the page after deletion

  }
  const validateInput = (formData) => {
    const fData = [ formData.get("userNameInput"),
                    formData.get("firstNameInput"),
                    formData.get("middleNameInput"),
                    formData.get("lastNameInput"),
                    formData.get("roleInput"),
                    formData.get("passwordInput"),
                    formData.get("departmentInput"),
                    formData.get("emailInput")
                  ]; // Get form

    for (const [index, data] of fData.entries()) {
      if (!data) { // Check if data is falsy (empty string, null, undefined, etc.)
          alert(`Please enter a valid value for ${["Id", "First Name", "Middle Name", "Last Name", "Email","Password","Role","Department"][index]}.`);
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
                <label htmlFor="username">ID:</label>
                <input
                  name="userNameInput"
                  type="text"
                  className="form-control"
                  id="username"
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
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              
              {/* Email Field */}
              <div className="mb-3">
                <label htmlFor="firstName">Email:</label>
                <input
                  name="emailInput"
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

              {/* Role Field */}
              <div className="mb-3">
                <label htmlFor="role">Department:</label>
                <select
                  name="departmentInput"
                  className="form-select"
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="" disabled>-- Choose Department --</option>
                  <option value="CICS">CICS</option>
                  <option value="CTE">CTE</option>
                  <option value="CABE">CABE</option>
                  <option value="CAS">CAS</option>
                  <option value="CAS">CIT</option>
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
