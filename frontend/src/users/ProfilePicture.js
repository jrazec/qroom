// frontend/users/ProfilePicture.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function ProfilePicture({ user_name }) {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const response = await axios.get(`/user/${user_name}/profile-picture`);
        setProfilePic(response.data.imageUrl);
        console.log("Fetched Profile Picture URL:", `http://localhost:3001${response.data.imageUrl}`);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
        alert("Error fetching profile picture. Please check the console for details.");
      }
    };

    fetchProfilePicture();
  }, [user_name]);

  const handlePictureChange = async () => {
    if (!file) return alert("Please select a picture to upload.");

    const formData = new FormData();
    formData.append("picture", file);
    formData.append("user_name", user_name);

    try {
      const response = await axios.post("/user/picture/upload", formData);
      alert(response.data.message);
      setProfilePic(response.data.imageUrl);
      setShowModal(false);
    } catch (error) {
      console.error("Error uploading picture:", error);
      alert("Error uploading picture.");
    }
  };

  return (
    <div>
      <h5>Profile Picture</h5>
      <img
        src={profilePic ? `http://localhost:3001${profilePic}` : "https://via.placeholder.com/150"}
        alt="Profile"
        className="img-thumbnail"
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
      <Button onClick={() => setShowModal(true)} className="btn btn-danger">Change Picture</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePictureChange} className="btn btn-danger">Upload</Button>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePicture;
