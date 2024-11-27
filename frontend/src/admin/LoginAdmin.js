import React, { useState } from "react";
import './LoginAdmin.css';
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component

function LoginAdmin() {
  const [stat, setStatus] = useState(null); // Login status
  const [userName, setUserName] = useState(''); // Username input
  const [password, setPassword] = useState(''); // Password input
  const [showModal, setShowModal] = useState(false); // Modal visibility state for wrong credentials
  const [captchaToken, setCaptchaToken] = useState(null); // Store CAPTCHA token

  const navigate = useNavigate(); // Initialize the navigate function

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Save the CAPTCHA token
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure CAPTCHA is completed
    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }
  
    try {
      // Send the login credentials along with the CAPTCHA token
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,   // user_name should be passed to the backend
          password,              // password should be passed to the backend
          captcha: captchaToken, // CAPTCHA token to send to backend
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        // Store the token and navigate to the admin dashboard
        localStorage.setItem('token', data.token);
        localStorage.setItem('user_name', data.user.user_name);
        localStorage.setItem('role', data.user.role);
        setStatus(true);
        navigate('/admin/dashboard');
      } else {
        setStatus(false);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error logging in. Please try again.');
    }
  };
  
  

  return (
    <div className="modern-login-page">
      <div className="login-container container-fluid">
        <div className="row justify-content-center align-items-center h-100">
          {/* Left Section - Hide on smaller screens */}
          <div className="col-md-6 text-center d-none d-md-block">
            <h1 className="brand-logo">QRoom</h1>
            <img
              src="https://via.placeholder.com/400"
              alt="VR Experience"
              className="vr-image"
            />
          </div>

          {/* Right Section - Login Form */}
          <div className="col-md-4 col-10">
            <div className="card shadow-lg p-4 login-card">
              <h3 className="text-center brand-name">Ravzberie.</h3>
              <h4 className="text-center mb-4">Login</h4>

              <form onSubmit={handleSubmit} name="login">
                <div className="form-group mb-4">
                  <label htmlFor="srCode">SR-CODE</label>
                  <input
                    name="userName"
                    type="text"
                    className="form-control modern-input"
                    id="srCode"
                    placeholder="Enter your SR-code"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="password">PASSWORD</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control modern-input"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <small className="form-text text-muted mb-4">
                  Password is case sensitive
                </small>

                {/* CAPTCHA Section */}
                <div className="captcha-container mb-3">
                  <ReCAPTCHA
                    sitekey="6LfT84cqAAAAAL8yzip2W08lSkixpwTpL2nytHny"  // Use your actual site key
                    onChange={handleCaptchaChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 login-btn mt-4">
                  LOGIN
                </button>
              </form>

              {/* Highlight the 'Forgot Password' link if login failed */}
              <div className="text-center mt-3">
                <a
                  href="#"
                  className={`forgot-password-link ${stat === false ? 'highlight' : ''}`}
                >
                  FORGOT PASSWORD
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Wrong Credentials */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Wrong Credentials</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please check your SR-CODE and PASSWORD.</p>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LoginAdmin;
