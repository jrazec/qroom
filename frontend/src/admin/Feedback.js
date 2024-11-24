import React, { useState, useEffect } from "react";
import "./Feedback.css"; // Custom styles for additional customization
import axios from "axios";

// Modal component for viewing enlarged image
const ImageModal = ({ image, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={image} alt="Enlarged" className="modal-image" />
        <button onClick={onClose} className="close-modal-btn">
          Close
        </button>
      </div>
    </div>
  );
};

const Feedback = () => {
  const [reports, setReports] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reports from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("http://localhost:3001/room-reports");
        setReports(response.data); // Store fetched reports in the state
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // Handle image click to show modal
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  // Remove a specific report
  const removeReport = async (reportId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/room-reports/delete/${reportId}`);
      console.log(response.data.message); // Log the backend response
      setReports(reports.filter((report) => report.room_report_id !== reportId)); // Update the frontend state
    } catch (error) {
      console.error("Error removing report:", error);
    }
  };

  // Remove all reports
  const removeAllReports = async () => {
    try {
      const response = await axios.delete("http://localhost:3001/room-reports/delete-all");
      console.log(response.data.message); // Log the backend response
      setReports([]); // Clear the frontend state
    } catch (error) {
      console.error("Error removing all reports:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header text-center mb-4">
        <h1 className="dashboard-title">
          Dashboard <span className="sub-title">Feedback</span>
        </h1>
      </div>

      <h3 className="room-title">Classroom Reports</h3>

      <div className="feedback-sections container">
        <div className="row">
          {/* Classroom Reports Table */}
          <div className="col-lg-6 col-md-6">
            <div className="table-scrollable">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Room Report ID</th>
                    <th>Room ID</th>
                    <th>Room Name</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Approval</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No reports available.
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <tr key={report.room_report_id}>
                        <td>{report.room_report_id}</td>
                        <td>{report.room_id}</td>
                        <td>{report.room_name}</td>
                        <td>{report.status}</td>
                        <td>
                          {report.image !== "No image uploaded" ? (
                            <img
                              src={`http://localhost:3001${report.image}`}
                              alt="Report"
                              className="report-image"
                              onClick={() =>
                                handleImageClick(`http://localhost:3001${report.image}`)
                              }
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{report.approval}</td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => removeReport(report.room_report_id)}
                          >
                            Remove One
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* Remove All Button */}
            {reports.length > 0 && (
              <div className="text-center mt-3">
                <button className="btn btn-danger" onClick={removeAllReports}>
                  Remove All
                </button>
              </div>
            )}
          </div>

          {/* Reports Column */}
          <div className="col-lg-6 col-md-6">
            <div className="table-container">
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Placeholder for dynamic rows later */}
                  {[...Array(10)].map((_, i) => (
                    <tr key={i}>
                      <td className="report-cell">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && <ImageModal image={selectedImage} onClose={closeModal} />}
    </div>
  );
};

export default Feedback;
