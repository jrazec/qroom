import React, { useState, useRef, useEffect,createContext } from "react";
import "./Accounts.css";
import AddAccount from "./modals/AddAccount";
import EditAccount from "./modals/EditAccount"; // Import EditAccount component
import { fetchGroupAccounts } from "./api/api";

const DataContext = createContext();

function Accounts() {
    const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
    const [selectedAccount, setSelectedAccount] = useState(null); // State to store the selected account
    const [role, setRole] = useState("all");
    const [data, setData] = useState([]); // Renamed from Data to data to follow JS conventions
    const [groupAccounts, setGroupAccounts] = useState([]); // Initialize as an empty array

    const selectRef = useRef(null); 

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGroupAccounts();
            console.log(data);
            setData(data);
            setGroupAccounts(data); // Set initial groupAccounts to the fetched data
        };

        fetchData();
    }, []);

    // Update groupAccounts when role or data changes
    useEffect(() => {
        if (role === "student") {
            setGroupAccounts(data.filter(user => user.role === "student"));
        } else if (role === "instructor") {
            setGroupAccounts(data.filter(user => user.role === "instructor"));
        } else {
            setGroupAccounts(data); // Show all accounts if "all" is selected
        }
    }, [role, data]); // Effect runs when 'role' or 'data' changes

    // Function to open the Edit modal with the selected account data
    const handleEditClick = (account) => {
        setSelectedAccount(account); // Set the selected account data to pass to EditAccount
        setShowEditModal(true); // Show the Edit modal
    };

    // Function to close the Edit modal
    const closeEditModal = () => {
        setShowEditModal(false); // Hide the Edit modal
    };

    const selectChange = (e) => {
        setRole(e.target.value); // Update the selected role
    };

    const dynamicTableValues = groupAccounts.map((account, index) => (
      <tr key={index}>
          <td>{account.role}</td>
          <td>{account.user_name}</td>
          <td>{account.first_name}</td>
          <td>{account.last_name}</td>
          <td>{account.middle_name}</td>
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
    ))

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
                <h1 className="h2 text-danger font-weight-bold">Dashboard <small className="text-muted">Manage Accounts</small></h1>
            </div>
  
            <div className="d-flex align-items-center mb-3 justify-content-between">
                <div>
                    <select id="role" className="form-control d-inline-block w-auto mr-3" name="roleSelection" 
                        ref={selectRef}
                        onChange={selectChange}>
                        <option value="all">--All Users--</option>
                        <option value="instructor">Instructor</option>
                        <option value="student">Student</option>
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
                        <tr className="text-center">
                            <th>Role</th>
                            <th>User Name</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Middle Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dynamicTableValues}
                    </tbody>
                </table>
            </div>

            {/* Add Account Modal */}
            <AddAccount data={data} setData={setData} groupAccounts={groupAccounts} setGroupAccounts={setGroupAccounts}/>

            {/* Edit Account Modal */}
            {showEditModal && <EditAccount existingData={selectedAccount} closeEditModal={closeEditModal} />}
        </>

    );
}

export default Accounts;
