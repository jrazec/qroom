import React, { useState } from 'react';
import Navbar from './Navbar';
import FeedbackCss from './FeedbackPage.module.css'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

function FeedbackPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [warning, setWarning] = useState('');
  const [result, setResult] = useState('');
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Replace with your actual API key
  console.log(API_KEY)
  // Toggle Chat Mode
  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setWarning(''); // Clear previous warnings
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear Image
  const clearImage = () => {
    setImage(null);
    setWarning('');
    setResult('');
  };

  // Submit Image for Classification
  const handleSubmit = async () => {
    if (!image) {
      setWarning('Please upload an image before submitting.');
      return;
    }

    setResult('Checking...');
    setWarning('');

    // Create an instance of the generative AI API
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    try {
      const contents = [
        {
          role: 'user',
          parts: [
            {
              inline_data: { mime_type: 'image/jpeg', data: image.split(',')[1] },
            },
            {
              text: `Classify this image. 
                      Determine if the image depicts a classroom. 
                      If it does not, respond with 'Not a classroom, try again.'
                      If the image is a classroom, assess its cleanliness:
                        If the classroom appears clean, respond with 'Clean.'
                        If the classroom appears dirty, respond with 'Dirty.'
                        If the cleanliness is unclear, blurred, not clear, or uncertain, respond with 'Unsure.'`,
            },
          ],
        },
      ];

      const response = await model.generateContent({ contents });
      console.log('API Response:', response.response); // For debugging

      if (!response.response || !response.response.candidates || response.response.candidates.length === 0) {
        setWarning('No valid response from the API. Please try again later.');
        return;
      }

      const generatedText = response.response.candidates[0].content.parts[0].text;
      console.log('Generated Text:', generatedText);

      let classification = 'unsure';
      if (generatedText.toLowerCase().includes('clean')) {
        classification = 'clean';
      } else if (generatedText.toLowerCase().includes('dirty')) {
        classification = 'dirty';
      }

      setResult(`Classroom is ${classification}.`);

      // Report to backend with the cleanliness status
      await fetch('/user/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, status: classification }),
      });

    } catch (error) {
      console.error('Error during submission:', error);
      setWarning('An error occurred during submission. Please try again.');
    }
  };

  return (
    <div className={`${FeedbackCss.app} ${isChatOpen ? FeedbackCss.chatMode : ''}`}>
      <Navbar id={id} />
      <main className={`container text-center py-5 ${FeedbackCss.mainContent}`}>
        <div className={FeedbackCss.contentWrapper}>
          {!isChatOpen ? (
            <>
              <div className={`mb-4 ${FeedbackCss.imageContainer}`}>
                {image ? (
                  <img
                    src={image}
                    alt="Preview"
                    className={FeedbackCss.imagePreview}
                    onClick={() => document.getElementById('imageUpload').click()}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <button
                    onClick={() => document.getElementById('imageUpload').click()}
                    className={`btn btn-outline-secondary ${FeedbackCss.uploadButton}`}
                  >
                    Upload Image Here
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  id="imageUpload"
                  style={{ display: 'none' }}
                />
              </div>

              {image && (
                <button onClick={clearImage} className={`btn btn-secondary mb-4 ${FeedbackCss.clearButton}`}>
                  Clear/Remove Picture
                </button>
              )}

              {warning && <div className="text-danger mb-3">{warning}</div>}
              {result && <p>{result}</p>}

              <div className={`d-flex justify-content-center align-items-center ${FeedbackCss.passwordContainer}`}>
                <button onClick={handleSubmit} className={`btn btn-danger rounded-pill ${FeedbackCss.sendButton}`}>
                  SUBMIT
                </button>
              </div>
            </>
          ) : (
            <>
              <div className={`mb-4 d-flex justify-content-between align-items-center ${FeedbackCss.chatHeader}`}>
                <button className="btn btn-link text-danger" onClick={handleChatToggle}>
                  Back
                </button>
                <input type="text" placeholder="Search" className={`form-control rounded-pill me-2 ${FeedbackCss.searchInput}`} />
                <button className={`btn btn-danger rounded-pill ${FeedbackCss.searchButton}`}>Search</button>
              </div>
              <div className={`mb-4 ${FeedbackCss.chatContent}`}>
                <div className={FeedbackCss.chatBubble}>Sample chat message...</div>
              </div>
            </>
          )}
        </div>

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
