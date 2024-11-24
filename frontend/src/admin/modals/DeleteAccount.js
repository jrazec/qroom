import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min';  // Import Bootstrap JS for modal functionality
import "./AddAccount.css";  // Reuse AddAccount.css for consistent styling
import { deleteAccount } from "../../api/api";

function DeleteAccount({ existingData, closeDeleteModal }) {
  const [userName, setUserName] = useState(existingData.user_name || '');
  const [firstName, setFirstName] = useState(existingData.first_name || ''); // Corrected `firstname` to `first_name`
  const [middleName, setMiddleName] = useState(existingData.middle_name || ''); // Corrected `middlename` to `middle_name`
  const [lastName, setLastName] = useState(existingData.last_name || ''); // Corrected `lastname` to `last_name`
  const [role, setRole] = useState(existingData.role || '');

  const deleteUser = async () => {
    const dataToSend = {
      userName: userName, // Passing the username for deletion
    };
    
    try {
      await deleteAccount(dataToSend);
      setTimeout(() => {
        window.location.reload(); // Reload the page after deletion
      }, 500);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteUser();
    closeDeleteModal(); // Close the modal
  };

  return (
    <div
      className="modal fade show" // Ensure the modal is displayed
      tabIndex="-1"
      role="dialog"
      aria-labelledby="deleteAccountModalLabel"
      aria-hidden="true"
      style={{ display: 'block' }} // Modal should be visible
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Delete Account</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeDeleteModal} // Close modal on click
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-3">
            <form onSubmit={handleSubmit}>
              {/* Confirmation Text */}
              <div className="mb-3">
                <p>Are you sure you want to delete {firstName} {middleName} {lastName}?</p>
                <div>Username: {userName}</div>
                <div>Role: {role}</div>
              </div>

              {/* Add and Cancel buttons */}
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteAccount;
