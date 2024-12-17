import React, { useState } from "react";
import './LoginUser.css';
import { useNavigate } from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { checkCreds } from "../api/api"; // Ensure this is the correct path to your api.js file
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component (commented out for now)

function LoginUser() {
  const [stat, setStatus] = useState(null); // Login status, set initial state to null
  const [userName, setUserName] = useState(''); // Username input
  const [password, setPassword] = useState(''); // Password input
  const [showModal, setShowModal] = useState(false); // Modal visibility state for wrong credentials
  const [captchaToken, setCaptchaToken] = useState(null); // reCAPTCHA token

  const [forgotEmail, setForgotEmail] = useState("");  // Email for forgot password
  const [emailValid, setEmailValid] = useState(true);   // Email validation state

  const navigate = useNavigate(); // Initialize the navigate function

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Save the CAPTCHA token
  };

  // Handle Forgot Password Submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
  
    // Check if the email is valid
    const emailPattern = /^[a-zA-Z0-9._%+-]+@g\.batstate-u\.edu\.ph$/;  // Regex for validating the email
    if (!emailPattern.test(forgotEmail)) {
      setEmailValid(false);
      return;
    }
  
    const userName = forgotEmail.split('@')[0]; // Extract the user_name part (before the '@' symbol)
  
    try {
      // Call the API to send the reset link
      const response = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/user/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: userName }),  // Send the user_name (SR Code) to the backend
      });
  
      const data = await response.json();
      if (data.status) {
        alert("Password reset link sent to your email.");
        // Reset form and state
        setForgotEmail('');
        setEmailValid(true);
      } else {
        alert(data.message || "Failed to send password reset link.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };
  
  

  // Handle regular login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }

    try {
      // Call the API to check credentials
      const data = await checkCreds({ user_name: userName, password });

      if (data.status) {
        // Store token and user_name in localStorage
        localStorage.setItem('token', data.token); // Store the token
        localStorage.setItem('user_name', data.user.user_name); // Store user_name
        localStorage.setItem('role', data.user.role); // Store user role
        setStatus(true); // Set login status to true
        navigate(`/user/home/${data.user.user_name}`); // Redirect to user's home page
      } else {
        setStatus(false); // Set login status to false
        setShowModal(true); // Show the modal for wrong credentials
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
              src="/assets/qroom-login.png"
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
                    sitekey={process.env.REACT_APP_CAPTCHA_API_KEY} // Replace with your actual site key
                    onChange={handleCaptchaChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 login-btn mt-4">
                  LOGIN
                </button>
              </form>

              {/* Forgot Password Link */}
              <div className="text-center mt-3">
                <a
                  href="#"
                  className={`forgot-password-link ${stat === false ? 'highlight' : ''}`}
                  data-toggle="modal"
                  data-target="#forgotPasswordModal"
                >
                  FORGOT PASSWORD
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bootstrap Modal for Forgot Password */}
      <div className="modal fade" id="forgotPasswordModal" tabIndex="-1" role="dialog" aria-labelledby="forgotPasswordModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="forgotPasswordModalLabel">Forgot Password</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleForgotPasswordSubmit}>
                <div className="form-group">
                  <label htmlFor="forgotEmail">Enter your registered email:</label>
                  <input
                    type="email"
                    id="forgotEmail"
                    className="form-control"
                    placeholder="Enter your email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                  {!emailValid && <small className="text-danger">Please enter a valid Batangas State University email address.</small>}
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
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

export default LoginUser;
