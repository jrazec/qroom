import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import FeedbackCss from "./FeedbackPage.module.css"
import ProfilePicture from "./ProfilePicture";
import ChangePassword from "./ChangePassword";
import { Card, Container, Row, Col, Button, Modal } from "react-bootstrap";
import { FaUserCircle, FaKey, FaSignOutAlt } from "react-icons/fa";

function Settings() {
  const { id } = useParams(); // Get the id from the URL (this is your user_name)
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const loggedInUserName = localStorage.getItem("user_name"); // Get user_name from localStorage
    
    // Compare id from the URL with the logged-in user_name from localStorage
    if (!loggedInUserName || loggedInUserName === "undefined" || loggedInUserName !== id) {
      alert("Access forbidden");
      navigate("/not-found"); // Redirect to the correct page if the user does not match
    }
  }, [id, navigate]); // Run this effect whenever the `id` or `navigate` changes

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_name");  // Remove user_name (not userId, since you're using user_name as ID)
    setShowLogoutModal(false);
    navigate("/user/login");
  };

  return (
    <div className={`${FeedbackCss.app}`}>
      <Navbar id={id} />
      <main className={`container text-center py-5 ${FeedbackCss.mainContent}`}>
      <Container >


        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="mb-4 shadow-sm">
              <Card.Header className="d-flex align-items-center">
                <FaUserCircle className="me-2" size={24} />
                <span>Profile Picture</span>
              </Card.Header>
              <Card.Body className="text-center">
                <ProfilePicture user_name={id} />
              </Card.Body>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Header className="d-flex align-items-center">
                <FaKey className="me-2" size={24} />
                <span>Change Password</span>
              </Card.Header>
              <Card.Body className="text-center">
                <ChangePassword user_name={id} />
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <Button
                  onClick={() => setShowLogoutModal(true)}
                  variant="danger"
                  className="d-flex align-items-center justify-content-center"
                >
                  <FaSignOutAlt className="me-2" size={18} />
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      </main>
    
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to log out?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            Yes, Log Out
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default Settings;
