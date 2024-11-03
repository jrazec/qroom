// frontend/users/Settings.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProfilePicture from "./ProfilePicture";
import ChangePassword from "./ChangePassword";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import { FaUserCircle, FaKey, FaSignOutAlt } from "react-icons/fa"; // Icons for clarity

function Settings() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div>
      <Navbar />
      <Container className="mt-5">
        <h1 className="text-center mb-4">Settings</h1>

        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            {/* Profile Picture Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="d-flex align-items-center">
                <FaUserCircle className="me-2" size={24} />
                <span>Profile Picture</span>
              </Card.Header>
              <Card.Body className="text-center">
                <ProfilePicture user_name={id} />
              </Card.Body>
            </Card>

            {/* Change Password Section */}
            <Card className="mb-4 shadow-sm">
              <Card.Header className="d-flex align-items-center">
                <FaKey className="me-2" size={24} />
                <span>Change Password</span>
              </Card.Header>
              <Card.Body className="text-center">
                <ChangePassword user_name={id} />
              </Card.Body>
            </Card>

            {/* Logout Section */}
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <Button onClick={handleLogout} variant="danger" className="d-flex align-items-center justify-content-center">
                  <FaSignOutAlt className="me-2" size={18} />
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Settings;
