import React, { useState, useRef } from "react";
import "./Accounts.css";
import AddAccount from "./modals/AddAccount";
import EditAccount from "./modals/EditAccount"; // Import EditAccount component
import { cur } from "../App";

function Accounts() {
    const [dept, setDept] = useState('');
    const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
    const [selectedAccount, setSelectedAccount] = useState(null); // State to store the selected account
    const selectRef = useRef(null);

    const selectChange = (e) => {
      cur.dept = e.target.value;
      console.log(cur.dept);
      setDept(e.target.value);
    };

    // Function to open the Edit modal with the selected account data
    const handleEditClick = (account) => {
      setSelectedAccount(account); // Set the selected account data to pass to EditAccount
      setShowEditModal(true); // Show the Edit modal
    };

    // Function to close the Edit modal
    const closeEditModal = () => {
      setShowEditModal(false); // Hide the Edit modal
    };

    // Sample account data (replace this with your actual data)
    const sampleAccounts = [
      { userName: "john_doe", firstName: "John", lastName: "Doe", password: "password123", role: "Instructor" },
      { userName: "jane_smith", firstName: "Jane", lastName: "Smith", password: "password456", role: "Student" },
      { userName: "jane_smith", firstName: "Jane", lastName: "Smith", password: "password456", role: "Student" },
      { userName: "jane_smith", firstName: "Jane", lastName: "Smith", password: "password456", role: "Student" }
    ];

    return (
        <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h2 text-danger font-weight-bold">Dashboard <small className="text-muted">Manage Accounts</small></h1>
        </div>
  
        <div className="d-flex align-items-center mb-3 justify-content-between">
          <div>
            <label htmlFor="role" className="font-weight-bold mr-2">{(dept === '') ? "Choose Role" : dept}</label>
            <select id="role" className="form-control d-inline-block w-auto mr-3" name="roleelection" 
              ref={selectRef}
              onChange={selectChange}>
              <option value="">Choose here.</option>
              <option value="cics">CICS</option>
              <option value="cte">CTE</option>
              <option value="cas">CAS</option>
              <option value="cabe">CABE</option>
            </select>
          </div>
          
          <div>
            <input type="search" name="searchAccount" id="searchAccount" placeholder="Enter name here"/>
            <button className="btn btn-danger" type="button" data-toggle="modal" data-target=".bd-example-modal-lg">+ add</button>
          </div>
        </div>
  
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover custom-table">
            <thead>
              {/* Add table headers if needed */}
            </thead>
            <tbody>
              {sampleAccounts.map((account, index) => (
                <tr key={index}>
                  <td>{account.userName}</td>
                  <td>{account.firstName}</td>
                  <td>{account.lastName}</td>
                  <td>{account.role}</td>
                  <td className="text-center">
                    <button 
                      className="btn btn-dark btn-sm edit-btn"
                      onClick={() => handleEditClick(account)} // Show Edit modal on click
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="btn btn-light btn-sm delete-btn"><i className="fas fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Account Modal */}
        <AddAccount />

        {/* Edit Account Modal */}
        {showEditModal && <EditAccount existingData={selectedAccount} closeEditModal={closeEditModal} />}
        </>
    );
}

export default Accounts;
