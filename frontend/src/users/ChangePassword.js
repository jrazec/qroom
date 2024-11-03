// frontend/users/ChangePassword.js
import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function ChangePassword({ user_name }) {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/user/change-password", {
        user_name: user_name,
        oldpass: oldPassword,
        newpass: newPassword
      });
      alert(response.data.message);
      setShowModal(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please check the console for details.");
    }
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)} className="btn btn-danger">Change Password</Button>
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
          <Button onClick={handlePasswordChange} className="btn btn-danger">Change Password</Button>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ChangePassword;
