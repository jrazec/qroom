import React, { useState } from 'react';
import Navbar from './Navbar';
import FeedbackCss from './FeedbackPage.module.css'; // Import the CSS module with alias
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';

function FeedbackPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const {id} = useParams();
  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className={`${FeedbackCss.app} ${isChatOpen ? FeedbackCss.chatMode : ''}`}>
      <Navbar id={id}/>
      <main className={`container text-center py-5 ${FeedbackCss.mainContent}`}>
        <div className={FeedbackCss.contentWrapper}>
          {!isChatOpen ? (
            <>
              {/* Feedback Page Content */}
              <div className={`mb-4 d-flex justify-content-center ${FeedbackCss.searchContainer}`}>
                <input 
                  type="text" 
                  placeholder="search" 
                  className={`form-control rounded-pill me-2 ${FeedbackCss.searchInput}`}
                />
                <button className={`btn btn-danger rounded-pill ${FeedbackCss.searchButton}`}>search</button>
              </div>

              <div className={`mb-4 ${FeedbackCss.imageContainer}`}>
                <img 
                  src="https://picsum.photos/500/300" 
                  alt="Random" 
                  className={`img-fluid rounded shadow ${FeedbackCss.feedbackImage}`}
                />
              </div>

              <div className={`d-flex justify-content-center align-items-center ${FeedbackCss.passwordContainer}`}>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className={`form-control me-2 rounded-pill ${FeedbackCss.passwordInput}`}
                />
                <button className={`btn btn-danger rounded-pill ${FeedbackCss.sendButton}`}>send</button>
              </div>

              {/* Chat Button */}
              <div className={FeedbackCss.chatButton}>
                <button className={`btn btn-danger rounded-circle ${FeedbackCss.chatIcon}`} onClick={handleChatToggle}>
                  <i className="fa fa-comments"></i>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Chat Page Content */}
              <div className={`mb-4 d-flex justify-content-between align-items-center ${FeedbackCss.chatHeader}`}>
                <button className="btn btn-link text-danger" onClick={handleChatToggle}>
                  back
                </button>
                <input type="text" placeholder="search" className={`form-control rounded-pill me-2 ${FeedbackCss.searchInput}`} />
                <button className={`btn btn-danger rounded-pill ${FeedbackCss.searchButton}`}>search</button>
              </div>

              <div className={`mb-4 ${FeedbackCss.chatContent}`}>
                <div className={FeedbackCss.chatBubble}>hhhhhhhhhhhhhh</div>
                <div className={FeedbackCss.chatBubble}>hellllllllllooooo</div>
              </div>

              <div className={`d-flex justify-content-center align-items-center ${FeedbackCss.passwordContainer}`}>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className={`form-control me-2 rounded-pill ${FeedbackCss.passwordInput}`}
                />
                <button className={`btn btn-danger rounded-pill ${FeedbackCss.sendButton}`}>send</button>
              </div>
            </>
          )}
        </div>
        
        {/* Social Media Icons (Always Visible) */}
        <div className={`position-fixed start-0 bottom-0 ms-3 mb-3 ${FeedbackCss.socialIcons}`}>
          <a href="#" className={`btn btn-danger mb-2 rounded-circle ${FeedbackCss.socialIcon}`}>
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" className={`btn btn-danger mb-2 rounded-circle ${FeedbackCss.socialIcon}`}>
            <i className="fa fa-envelope"></i>
          </a>
          <a href="#" className={`btn btn-danger rounded-circle ${FeedbackCss.socialIcon}`}>
            <i className="fa fa-twitter"></i>
          </a>
        </div>
      </main>
    </div>
  );
}

export default FeedbackPage;
