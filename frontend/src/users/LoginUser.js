import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import './LoginUser.css';
import { checkCreds } from "../api/api";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { Modal } from 'react-bootstrap'; // Import Bootstrap Modal

function LoginUser() {
    const [stat, setStatus] = useState(''); // Login status
    const [userName, setUserName] = useState(''); // Username input
    const [password, setPassword] = useState(''); // Password input
    const [captchaValue, setCaptchaValue] = useState(null); // Captcha value
    const [showModal, setShowModal] = useState(false); // Modal visibility state

    const navigate = useNavigate(); // Initialize the navigate function

    const handleCaptchaChange = (value) => {
        console.log("Captcha value:", value);
        setCaptchaValue(value); // Store the captcha value
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission

        // Call the backend API with user_name and password
        const data = await checkCreds({ user_name: userName, password });
        console.log(data);

        setStatus(data.status); // Set login status

        // Check if the login was successful
        if (data.status) {
            navigate(`/user/home/${userName}`); // Navigate to the home page
        } else {
            // If login failed, show modal and clear input fields
            setShowModal(true);
            setUserName(''); // Clear username input
            setPassword(''); // Clear password input
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
                                <div className="captcha-container">
                                    <ReCAPTCHA
                                        sitekey="your-site-key-here"
                                        onChange={handleCaptchaChange}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100 login-btn mt-4">LOGIN</button>
                            </form>

                            {/* Highlight the 'Forgot Password' link if login failed */}
                            <div className="text-center mt-3">
                                <a href="#"
                                   className={`forgot-password-link ${stat === false ? 'highlight' : ''}`}>
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
                    <button className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default LoginUser;
