import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { Modal, Button } from 'react-bootstrap';

function Settings() {
  const [showChangePicModal, setShowChangePicModal] = useState(false);
  const [showChangePassModal, setShowChangePassModal] = useState(false);
  const [file, setFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null); // State for the profile picture URL
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    // Fetch and display the current profile picture from the database
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(`/user/${id}/profile-picture`);
        setProfilePic(response.data.imageUrl); // Set the profile picture URL from the database
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };
    fetchProfilePicture();
  }, [id]);

  const handlePictureChange = async () => {
    if (!file) {
      alert("Please select a picture to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("picture", file);
    formData.append("user_name", id);

    try {
      const response = await axios.post("/user/picture/upload", formData);
      alert(response.data.message);
      setProfilePic(URL.createObjectURL(file)); // Immediately display the uploaded picture in the frame
      setShowChangePicModal(false);
    } catch (error) {
      alert("Error uploading picture.");
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("/user/change-password", {
        userid: id,
        oldpass: oldPassword,
        newpass: newPassword
      });
      if (response.data.message === "Password changed successfully") {
        alert(response.data.message);
      } else {
        alert("Failed to change password. Please check your old password.");
      }
      setShowChangePassModal(false);
    } catch (error) {
      alert("Error changing password.");
    }
  };

  const handleLogout = () => {
    navigate("/"); // Redirect to the homepage
  };

  return (
    <div>
      <Navbar /> {/* Navbar component */}

      <div className="container mt-5">
        <h1>Settings</h1>

        <div className="mb-4">
          <h5>Profile Picture</h5>
          <img 
            src={profilePic || "https://via.placeholder.com/150"} 
            alt="Profile" 
            className="img-thumbnail" 
            style={{ width: "150px", height: "150px" }}
          />
        </div>

        <div className="mt-4">
          <Button variant="primary" onClick={() => setShowChangePicModal(true)}>Change Picture</Button>
          <Button variant="secondary" className="ml-3" onClick={() => setShowChangePassModal(true)}>Change Password</Button>
          <Button variant="danger" className="ml-3" onClick={handleLogout}>Logout</Button>
        </div>
      </div>

      {/* Change Picture Modal */}
      <Modal show={showChangePicModal} onHide={() => setShowChangePicModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePictureChange}>Upload</Button>
          <Button variant="secondary" onClick={() => setShowChangePicModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showChangePassModal} onHide={() => setShowChangePassModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="password" placeholder="Old Password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="form-control mb-2" />
          <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control mb-2" />
          <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control mb-2" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handlePasswordChange}>Change Password</Button>
          <Button variant="secondary" onClick={() => setShowChangePassModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Settings;
