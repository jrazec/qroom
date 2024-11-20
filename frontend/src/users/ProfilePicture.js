import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function ProfilePicture({ user_name }) {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    // Clear the profile picture in localStorage when the user logs in
    localStorage.removeItem("profilePic");

    const fetchProfilePicture = async () => {
      try {
        // Fetch the user's profile picture from the server
        const response = await axios.get(`/user/${user_name}/profile-picture`);
        const imageUrl = response.data.imageUrl;

        if (imageUrl) {
          // Set the profile picture for the current user
          const fullImageUrl = `${process.env.REACT_APP_LOCALHOST}${imageUrl}`;
          setProfilePic(fullImageUrl);
        }
      } catch (error) {
        console.error("Error fetching profile picture:", error);
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
      // Upload the profile picture to the server
      const response = await axios.post("/user/picture/upload", formData);
      const imageUrl = response.data.imageUrl;

      if (imageUrl) {
        const fullImageUrl = `${process.env.REACT_APP_LOCALHOST}${imageUrl}`;
        setProfilePic(fullImageUrl); // Update the state with the new profile picture
        alert(response.data.message);
        setShowModal(false);
      }
    } catch (error) {
      alert("Error uploading picture. Please try again.");
    }
  };

  return (
    <div>
      <h5>Profile Picture</h5>
      <img
        src={profilePic || "https://via.placeholder.com/150"}
        alt="Profile"
        className="img-thumbnail"
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
      <Button onClick={() => setShowModal(true)} className="btn btn-danger">
        Change Picture
      </Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="form-control" />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handlePictureChange} className="btn btn-danger">
            Upload
          </Button>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProfilePicture;
