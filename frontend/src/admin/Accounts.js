import React, { useState, useRef, useEffect, createContext } from "react";
import "./Accounts.css";
import AddAccount from "./modals/AddAccount";
import EditAccount from "./modals/EditAccount"; // Import EditAccount component
import { getAccount } from "../api/api";
import DeleteAccount from "./modals/DeleteAccount";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Icons for edit and delete

export const DataContext = createContext(); // Export context

function Accounts() {
    const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
    const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control delete modal visibility
    const [selectedAccount, setSelectedAccount] = useState(null); // State to store the selected account
    const [role, setRole] = useState("all");
    const [data, setData] = useState([]); // Renamed from Data to data to follow JS conventions
    const [groupAccounts, setGroupAccounts] = useState([]); // Initialize as an empty array
    const [searchTerm, setSearchTerm] = useState(""); // State to track search input
    const [id, setId] = useState(null); // Store account ID for deletion

    const selectRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log("Component mounted");
            if (data.length === 0) { // Ensure it runs only if data is empty
                console.log("Fetching data...");
                
                const fetchedData = await getAccount();
                setData(fetchedData);
                setGroupAccounts(fetchedData);
            }
        };
    
        fetchData();
    }, []);

    // Function to update groupAccounts based on role, searchTerm, or custom filters
    const updateTableValues = (newRole, newSearchTerm) => {
        let filteredAccounts = data;

        // Set role if provided, else use the existing role state
        const currentRole = newRole || role;
        const currentSearchTerm = newSearchTerm || searchTerm;

        if (currentRole.toLowerCase() === "student") {
            filteredAccounts = data.filter(user => user.role.toLowerCase() === "student");
        } else if (currentRole.toLowerCase() === "instructor") {
            filteredAccounts = data.filter(user => user.role.toLowerCase() === "instructor");
        }

        // Filter by search term (if it exists)
        if (currentSearchTerm) {
            filteredAccounts = filteredAccounts.filter(
                user =>
                    user.first_name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                    user.middle_name.toLowerCase().includes(currentSearchTerm.toLowerCase())
            );
        }

        setGroupAccounts(filteredAccounts);
    };

    // Update groupAccounts when role or searchTerm changes
    useEffect(() => {
        updateTableValues();
    }, [role, searchTerm, data]); // Effect runs when 'role', 'data', or 'searchTerm' changes

    // Function to open the Edit modal with the selected account data
    const handleEditClick = (account) => {
        setSelectedAccount(account); // Set the selected account data to pass to EditAccount
        setShowEditModal(true); // Show the Edit modal
    };

    // Function to open the Delete modal with the selected account data
    const handleDeleteClick = (account) => {
        setSelectedAccount(account); // Set the selected account for deletion
        setShowDeleteModal(true); // Show the Delete modal
    };

    // Function to close the Edit modal
    const closeEditModal = () => {
        setShowEditModal(false); // Hide the Edit modal
    };

    // Function to close the Delete modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false); // Hide the Delete modal
    };

    const selectChange = (e) => {
        setRole(e.target.value); // Update the selected role
    };

    // Update searchTerm as the user types
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Update the search term state
    };

    const dynamicTableValues = groupAccounts.map((account, index) => (
        <tr key={index}>
            <td>{account.role}</td>
            <td>{account.user_name}</td>
            <td>{account.first_name}</td>
            <td>{account.last_name}</td>
            <td>{account.middle_name}</td>
            <td className="text-center">
                <FaEdit className="edit-icon" 
                        onClick={() => handleEditClick(account)} // Show Edit modal on click
                />
                <FaTrashAlt className="delete-icon ms-3" 
                            onClick={() => handleDeleteClick(account)} // Attach delete click event here
                />
            </td>
        </tr>
    ));

    return (
        <DataContext.Provider value={[ data, setData, groupAccounts, setGroupAccounts ]}>
        <div className="mother-div">
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
                    <input 
                        type="search" 
                        name="searchAccount" 
                        id="searchAccount" 
                        placeholder="Enter name here"
                        value={searchTerm} // Bind the input to searchTerm state
                        onChange={handleSearchChange} // Update searchTerm as the user types
                    />
                    <button className="btn btn-danger" type="button" data-toggle="modal" data-target="#addAccountModal">+ add</button>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive" id="acct-tbl">
                <table className="table-bordered table-hover">
                    <thead>
                        <tr className="text-center">
                            <th style={{ color: "white" }}>Role</th>
                            <th style={{ color: "white" }}>User Name</th>
                            <th style={{ color: "white" }}>First Name</th>
                            <th style={{ color: "white" }}>Last Name</th>
                            <th style={{ color: "white" }}>Middle Name</th>
                            <th style={{ color: "white" }}>Actions</th>
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

            {/* Delete Account Modal */}
            {showDeleteModal && <DeleteAccount existingData={selectedAccount} closeDeleteModal={closeDeleteModal} />}
        </div>
        </DataContext.Provider>
    );
}

export default Accounts;
