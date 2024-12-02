import React, { useState, useEffect } from "react";
import "./Feedback.css"; // Custom styles for additional customization
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// Modal component for viewing enlarged image
const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} alt="Enlarged" className="modal-image" />
        <button onClick={onClose} className="close-modal-btn">
          Close
        </button>
      </div>
    </div>
  );
};

const Feedback = () => {
  const [roomReports, setRoomReports] = useState([]); // Room Reports
  const [userReports, setUserReports] = useState([]); // User Reports
  const [selectedImage, setSelectedImage] = useState(null); // Selected Image for Modal

  // Fetch Room and User Reports from Backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch Room Reports
        const roomResponse = await axios.get(`${process.env.REACT_APP_LOCALHOST}/room-reports`);
        console.log("Fetched Room Reports:", roomResponse.data);
        setRoomReports(Array.isArray(roomResponse.data) ? roomResponse.data : []);

        // Fetch User Reports
        const userResponse = await axios.get(`${process.env.REACT_APP_LOCALHOST}/reports`);
        console.log("Fetched User Reports:", userResponse.data);

        if (userResponse.data && Array.isArray(userResponse.data.reports)) {
          setUserReports(userResponse.data.reports);
        } else if (Array.isArray(userResponse.data)) {
          setUserReports(userResponse.data); // Fallback in case `reports` key isn't present
        } else {
          setUserReports([]); // Default to an empty array
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // Handle Resolve Checkbox Change
  const handleResolveChange = async (reportId, currentResolved) => {
    const newResolved = currentResolved === "yes" ? "not yet" : "yes";

    try {
      await axios.patch(`${process.env.REACT_APP_LOCALHOST}/reports/update/${reportId}`, {
        resolved: newResolved,
      });

      setUserReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId ? { ...report, resolved: newResolved } : report
        )
      );
    } catch (error) {
      console.error("Error updating resolved status:", error);
    }
  };

  // Handle Approval Checkbox Change
  const handleApprovalChange = async (reportId, currentApproval) => {
    const newApproval = currentApproval === "approved" ? "not approved" : "approved";

    try {
      await axios.patch(`${process.env.REACT_APP_LOCALHOST}/room-reports/update/${reportId}`, {
        approval: newApproval,
      });

      setRoomReports((prevReports) =>
        prevReports.map((report) =>
          report.room_report_id === reportId
            ? { ...report, approval: newApproval }
            : report
        )
      );
    } catch (error) {
      console.error("Error updating approval status:", error);
    }
  };

  // Remove Specific Report
  const removeReport = async (reportId, isRoomReport = true) => {
    console.log("Attempting to delete report with ID:", reportId);

    try {
      if (isRoomReport) {
        await axios.delete(`${process.env.REACT_APP_LOCALHOST}/room-reports/delete/${reportId}`);
        setRoomReports((prevReports) =>
          prevReports.filter((report) => report.room_report_id !== reportId)
        );
      } else {
        await axios.delete(`${process.env.REACT_APP_LOCALHOST}/reports/delete/${reportId}`);
        setUserReports((prevReports) =>
          prevReports.filter((report) => report._id !== reportId)
        );
      }
      console.log(`Deleted report with ID: ${reportId}`);
    } catch (error) {
      console.error("Error removing report:", error);
    }
  };

  // Remove All Reports
  const removeAllReports = async (isRoomReport = true) => {
    try {
      if (isRoomReport) {
        await axios.delete(`${process.env.REACT_APP_LOCALHOST}/room-reports/delete-all`);
        setRoomReports([]);
      } else {
        await axios.delete(`${process.env.REACT_APP_LOCALHOST}/reports/delete-all`);
        setUserReports([]);
      }
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

      <div className="feedback-sections container">
        <div className="row" >
          {/* Room Reports Section */}
          <div className="col-lg-6 col-md-6" >
            <h3 className="room-title">Room Reports</h3>
            <div className="table-scrollable" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <table className="table table-borderless" >
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Room ID</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Approval</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roomReports.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No room reports available.
                      </td>
                    </tr>
                  ) : (
                    roomReports.map((report) => (
                      <tr key={report.room_report_id}>
                        <td>{report.room_name}</td>
                        <td>{report.room_id}</td>
                        <td>{report.status}</td>
                        <td>
                          {report.image && report.image !== "No image uploaded" ? (
                            <img
                              src={`${process.env.REACT_APP_LOCALHOST}${report.image}`}
                              alt="Report"
                              className="report-image"
                              onClick={() =>
                                setSelectedImage(`${process.env.REACT_APP_LOCALHOST}${report.image}`)
                              }
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={report.approval === "approved"}
                            onChange={() =>
                              handleApprovalChange(report.room_report_id, report.approval)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => removeReport(report.room_report_id)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {roomReports.length > 0 && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-danger"
                  onClick={() => removeAllReports(true)}
                >
                  Remove All
                </button>
              </div>
            )}
          </div>

          {/* User Reports Section */}
          <div className="col-lg-6 col-md-6">
            <h3 className="room-title">User Reports</h3>
            <div className="table-scrollable" style={{ maxHeight: "60vh", overflowY: "auto" }}>
              <table className="table table-borderless">
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Room ID</th>
                    <th>Report</th>
                    <th>Resolved</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userReports.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No user reports available.
                      </td>
                    </tr>
                  ) : (
                    userReports.map((report) => (
                      <tr key={report._id}>
                        <td>{report.room_name}</td>
                        <td>{report.room_id}</td>
                        <td>{report.report}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={report.resolved === "yes"}
                            onChange={() =>
                              handleResolveChange(report._id, report.resolved)
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            onClick={() => removeReport(report._id, false)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {userReports.length > 0 && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-danger"
                  onClick={() => removeAllReports(false)}
                >
                  Remove All
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Image */}
      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default Feedback;
