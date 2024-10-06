import React from "react";
import './LoginUser.css'

const image = "https://picsum.photos/500/500.webp";

function LoginUser() {
    return (
        <div className="modern-login-page">
          <div className="login-container container-fluid">
            <div className="row justify-content-center align-items-center h-100">
              
              {/* Left Section */}
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
                  
                  <form>
                    <div className="form-group mb-4">
                      <label htmlFor="srCode">SR-CODE</label>
                      <input 
                        type="text" 
                        className="form-control modern-input" 
                        id="srCode" 
                        placeholder="Enter your SR-code" 
                      />
                    </div>
                    <div className="form-group mb-4">
                      <label htmlFor="password">PASSWORD</label>
                      <input 
                        type="password" 
                        className="form-control modern-input" 
                        id="password" 
                        placeholder="Enter your password" 
                      />
                    </div>
                    <small className="form-text text-muted mb-4">
                      Password is case sensitive
                    </small>
                    <button type="submit" className="btn btn-primary w-100 login-btn">LOGIN</button>
                  </form>
    
                  <div className="text-center mt-3">
                    <a href="#" className="forgot-password-link">FORGOT PASSWORD</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
}

export default LoginUser;