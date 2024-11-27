import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import FeedbackCss from './FeedbackPage.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import axios from 'axios';

// Define the buildingMap globally
const buildingMap = {
  1: { name: "LEONOR SOLIS BUILDING", floors: ["1st Floor", "2nd Floor"] },
  2: { name: "VALERIO MALABANAN BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor"] },
  3: { name: "ANDRES BONIFACIO BUILDING", floors: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"] },
  4: { name: "GREGORIO ZARA BUILDING", floors: ["1st Floor", "2nd Floor"] },
};

function FeedbackPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [warning, setWarning] = useState('');
  const [result, setResult] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(''); // State for displaying feedback
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  useEffect(() => {
    const loggedInUserName = localStorage.getItem("user_name"); // Get user_name from localStorage
    
    // Compare id from the URL with the logged-in user_name from localStorage
    if (!loggedInUserName || loggedInUserName === "undefined" || loggedInUserName !== id) {
      alert("Access forbidden");
      navigate("/not-found"); // Redirect to the correct page if the user does not match
    }
  }, [id, navigate]);
  // Initialize buildings
  useEffect(() => {
    setBuildings(Object.entries(buildingMap).map(([id, { name }]) => ({ id, name })));
  }, []);

  // Fetch rooms dynamically based on selected building
  const fetchRooms = async (buildingId) => {
    const building = buildingMap[buildingId];
    if (building) {
      const buildingName = building.name;

      try {
        const response = await axios.get('/user/rooms/floor', {
          params: {
            building: buildingName,
          },
        });

        if (response.data && response.data.rooms) {
          setRooms(response.data.rooms);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]); // Clear rooms on error
      }
    } else {
      setRooms([]); // Clear rooms if the building is invalid
    }
  };

  const handleBuildingChange = (e) => {
    const buildingId = e.target.value;
    setSelectedBuilding(buildingId);
    setSelectedRoom(""); // Reset room selection
    fetchRooms(buildingId);
  };

  const handleRoomChange = (e) => {
    setSelectedRoom(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setWarning('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearImage = () => {
    setImage(null);
  };

  const classifyImageWithGemini = async () => {
    if (!image) {
      setWarning('Please upload an image before submitting.');
      return 'unsure';
    }

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
      const generatedText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (generatedText.toLowerCase().includes('clean')) {
        return 'clean';
      } else if (generatedText.toLowerCase().includes('dirty')) {
        return 'dirty';
      } else {
        return 'unsure';
      }
    } catch (error) {
      console.error("Error during classification:", error);
      setWarning('An error occurred during classification. Please try again.');
      return 'unsure';
    }
  };

  const handleSubmitFeedback = async () => {
    if (!selectedRoom) {
      setFeedbackMessage("Please select a room before submitting.");
      return;
    }
  
    const roomDetails = rooms.find((room) => String(room.room_id) === String(selectedRoom));
    const roomReportId = `room_report_${selectedRoom}_${Date.now()}`;
    const roomName = roomDetails?.room_name || "Unknown";
    const roomPurpose = roomDetails?.room_purpose || "Unknown";
  
    // Classify the image (clean, dirty, or unsure)
    const classification = await classifyImageWithGemini();
    setResult(`Classroom is ${classification}.`);
  
    // Set approval based on the classification result
    const approval = classification === "clean" ? "approved" : "not yet";
  
    // Create FormData and log it
    const formData = new FormData();
    formData.append("room_report_id", roomReportId);
    formData.append("room_id", selectedRoom);
    formData.append("room_name", roomName);
    formData.append("room_purpose", roomPurpose);
    formData.append("status", classification);
    formData.append("image", document.getElementById("imageUpload").files[0]); // Append actual file
    formData.append("approval", approval); // Dynamically set approval based on classification
  
    try {
      await axios.post(`${process.env.REACT_APP_LOCALHOST}/room-reports/submit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Show the classification result and thank-you message
      setFeedbackMessage(`${(classification !== "unsure") ? "The system detected that it is: "+ classification+". It will be further evaluated by the admin." : "The system is unsure about the photo, it will be validated by the admin or try resending a clear picture of a classroom."}.`);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackMessage("An error occurred while submitting feedback. Please try again.");
    }
  };  

  return (
    <div className={`${FeedbackCss.app} ${isChatOpen ? FeedbackCss.chatMode : ''}`}>
      <Navbar id={id} />
      <main className={`container text-center py-5 ${FeedbackCss.mainContent}`}>
        <div className={FeedbackCss.contentWrapper}>
          {!isChatOpen ? (
            <>
              {/* Dropdown for Buildings */}
              <div className="mb-4">
                <select
                  className="form-select"
                  value={selectedBuilding}
                  onChange={handleBuildingChange}
                >
                  <option value="">Select Building</option>
                  {buildings.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown for Rooms */}
              <div className="mb-4">
                <select
                  className="form-select"
                  value={selectedRoom}
                  onChange={handleRoomChange}
                  disabled={!rooms.length}
                >
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.room_id} value={room.room_id}>
                      {room.floor_number} | <strong>{room.room_name}</strong> ({room.room_purpose || "No purpose"})
                    </option>
                  ))}
                </select>
              </div>
              {/* Display Feedback Message */}
              {feedbackMessage && (
                <div className="mt-4 alert alert-info" role="alert">
                  {feedbackMessage}
                </div>
              )}
              {/* Image Upload Section */}
              <div className={`mb-4 ${FeedbackCss.imageContainer}`}>
                {image ? (
                  <div>
                    <img
                      src={image}
                      alt="Preview"
                      className={FeedbackCss.imagePreview}
                      onClick={() => document.getElementById('imageUpload').click()}
                      style={{ cursor: 'pointer' }}
                    />
                    <button
                      onClick={handleClearImage}
                      className="btn btn-outline-danger mt-2"
                    >
                      Clear Image
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => document.getElementById('imageUpload').click()}
                    className={`btn btn-outline-secondary ${FeedbackCss.uploadButton}`}
                    style={{ width: '100%',height:'30vh' }}
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

              {/* Submit Feedback Button */}
              <div>
                <button
                  onClick={handleSubmitFeedback}
                  className={`btn btn-danger rounded-pill ${FeedbackCss.sendButton}`}
                >
                  Submit Feedback
                </button>
              </div>

              {/* Navigate to ChatReport Button */}
            <div className="pt-3">
              <button
                onClick={() => navigate(`/chat-report/${id}`)} // Replace `/chat-report/${id}` with the actual route path to ChatReport
                className="btn btn-primary rounded-pill"
              >
                Go to Chat Report
              </button>
            </div>


            </>
          ) : (
            <>
              {/* Chat Section */}
              <div className={`mb-4 d-flex justify-content-between align-items-center ${FeedbackCss.chatHeader}`}>
                <button className="btn btn-link text-danger" onClick={() => setIsChatOpen(false)}>
                  Back
                </button>
                <input
                  type="text"
                  placeholder="Search"
                  className={`form-control rounded-pill me-2 ${FeedbackCss.searchInput}`}
                />
                <button className={`btn btn-danger rounded-pill ${FeedbackCss.searchButton}`}>
                  Search
                </button>
              </div>
              <div className={`mb-4 ${FeedbackCss.chatContent}`}>
                <div className={FeedbackCss.chatBubble}>Sample chat message...</div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default FeedbackPage;
