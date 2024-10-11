import React, { useState } from 'react';
import Navbar from './Navbar';
import './FeedbackPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function FeedbackPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={`app ${isChatOpen ? 'chat-mode' : ''}`}>
      <Navbar />
      <main className="main-content container text-center py-5">
        <div className="content-wrapper">
          {!isChatOpen ? (
            <>
              {/* Feedback Page Content */}
              <div className="search-container mb-4 d-flex justify-content-center">
                <input 
                  type="text" 
                  placeholder="search" 
                  className="form-control rounded-pill search-input me-2"
                />
                <button className="btn btn-danger rounded-pill">search</button>
              </div>

              <div className="image-container mb-4">
                <img 
                  src="https://picsum.photos/500/300" 
                  alt="Random" 
                  className="img-fluid rounded shadow feedback-image"
                />
              </div>

              <div className="password-container d-flex justify-content-center align-items-center">
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="form-control me-2 rounded-pill password-input"
                />
                <button className="btn btn-danger rounded-pill">send</button>
              </div>

              {/* Chat Button */}
              <div className="chat-button">
                <button className="btn btn-danger rounded-circle" onClick={handleChatToggle}>
                  <i className="fa fa-comments"></i>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Chat Page Content */}
              <div className="chat-header mb-4 d-flex justify-content-between align-items-center">
                <button className="btn btn-link text-danger" onClick={handleChatToggle}>
                  back
                </button>
                <input type="text" placeholder="search" className="form-control rounded-pill me-2" />
                <button className="btn btn-danger rounded-pill">search</button>
              </div>

              <div className="chat-content mb-4">
                <div className="chat-bubble">hhhhhhhhhhhhhh</div>
                <div className="chat-bubble">hellllllllllooooo</div>
              </div>

              <div className="password-container d-flex justify-content-center align-items-center">
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="form-control me-2 rounded-pill password-input"
                />
                <button className="btn btn-danger rounded-pill">send</button>
              </div>
            </>
          )}
        </div>
        
        {/* Social Media Icons (Always Visible) */}
        <div className="social-icons position-fixed start-0 bottom-0 ms-3 mb-3">
          <a href="#" className="social-icon btn btn-danger mb-2 rounded-circle">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className="social-icon btn btn-danger mb-2 rounded-circle">
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className="social-icon btn btn-danger rounded-circle">
            <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default FeedbackPage;
