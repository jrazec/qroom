import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function ChangePassword({ user_name }) {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state for better UX

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      // Log the data being sent for debugging purposes
      console.log("Sending password change request:", { user_name, oldPassword, newPassword });

      // Ensure that the URL is correct (you may need to use a full URL or set the base URL correctly in axios)
      const response = await axios.post("/user/change-password", {
        user_name,
        oldpass: oldPassword,
        newpass: newPassword,
      });

      console.log("Password change response:", response.data);

      if (response.data.success) {
        alert(response.data.message || "Password changed successfully");
        setShowModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(response.data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please try again later.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)} className="btn btn-danger">
        Change Password
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-control mb-2"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-control mb-2"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePasswordChange} className="btn btn-danger" disabled={loading}>
            {loading ? "Changing..." : "Change Password"}
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChangePassword;
