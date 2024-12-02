import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "bootstrap/dist/css/bootstrap.min.css";

Modal.setAppElement("#root");

function RoomPDFEditor() {
  const [rooms, setRooms] = useState([]);
  const [updatedRooms, setUpdatedRooms] = useState([]);
  const [preview, setPreview] = useState(null);
  const [downloadId, setDownloadId] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_LOCALHOST.replace("3000", "3001")}/admin/rooms`)
      .then((response) => {
        setRooms(response.data);
        setUpdatedRooms(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rooms:", error);
      });
  }, []);

  const handleRoomChange = (index, newName) => {
    const newRooms = [...updatedRooms];
    newRooms[index].name = newName;
    setUpdatedRooms(newRooms);
  };

  const handleUpdateDocument = () => {
    axios
      .post(`${process.env.REACT_APP_LOCALHOST.replace("3000", "3001")}/admin/update-document`, {
        rooms: updatedRooms.map(({ room_name, ...rest }) => rest),
      })
      .then((response) => {
        setPreview(response.data);
        setIsOpen(true);
      })
      .catch((error) => {
        console.log("Error updating document:", error);
      });
  };

  const extractDownloadUrl = (previewUrl) => {
    try {
      const url = new URL(previewUrl);
      const encodedFileUrl = url.searchParams.get("file");
      if (!encodedFileUrl) {
        throw new Error("No 'file' query parameter found in the preview URL.");
      }
      return decodeURIComponent(encodedFileUrl);
    } catch (error) {
      console.error("Error extracting download URL:", error.message);
      return null;
    }
  };

  const handleDownloadDocument = () => {

    window.open(`${extractDownloadUrl(preview.document.preview_url)}`, '_blank');
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Room PDF Editor</h1>
      <button
        className="btn btn-primary d-block mx-auto"
        onClick={() =>{
           handleUpdateDocument();
           setIsOpen(true)}}
      >
        Print QR Codes
      </button>

      {/* Modal for Room Name Inputs */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Room Name Editor"
        className="modal-dialog modal-dialog-centered modal-lg"
      >
        <div
          className="modal-content p-4"
          
        >
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="m-0">Edit Room Names</h2>
            <button className="btn btn-primary" onClick={handleDownloadDocument}>
              Download PDF
            </button>
          </div>
          <div className="d-flex flex-wrap gap-3"
              style={{ maxHeight: "80vh", overflowY: "auto" }} // Add scroll bar and height restriction
          >
            {rooms.map((room, index) => (
              <div
                key={index}
                className="d-flex flex-column align-items-start border p-3 rounded"
                style={{ width: "calc(33% - 1rem)" }}
              >
                <label htmlFor={`room-${index}`} className="form-label">
                  Room ID: {updatedRooms[index]?.room_id}
                </label>
                <input
                  id={`room-${index}`}
                  type="text"
                  className="form-control"
                  value={updatedRooms[index]?.name}
                  onChange={(e) => handleRoomChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default RoomPDFEditor;
