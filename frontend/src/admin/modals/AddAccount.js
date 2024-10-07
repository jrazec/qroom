import { useState, React } from "react";
import "./AddAccount.css"; 
import { cur } from "../../App";



function AddAccount() {
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomDesc, setRoomDesc] = useState('');
  const [roomImage, setRoomImage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log({ roomId, roomName, roomDesc, roomImage });
  };

  const withSelection = <>
     <div
      className="modal fade bd-example-modal-lg"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="firstbody p-3">
          <div>
             Choose a Department First
            </div>
            
          </div>
        </div>
      </div>
    </div>
  </>

  const withoutSelection = <>
    <div
      className="modal fade bd-example-modal-lg"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="firstbody p-3">
          <div>
              {cur.dept}
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="add-room-id">Room ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="add-room-id"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-room-name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="add-room-name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-room-desc">Purpose</label>
                <textarea
                  className="form-control"
                  name="add-room-desc"
                  value={roomDesc}
                  onChange={(e) => setRoomDesc(e.target.value)}
                  style={{ width: '100%', height: '60px', resize: 'none' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="add-room-image">Image</label>
                <input
                  type="text"
                  className="form-control"
                  name="add-room-image"
                  value={roomImage}
                  onChange={(e) => setRoomImage(e.target.value)}
                />
              </div>

              <input type="submit" className="btn btn-primary" name="addSubmitBtn" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </>

  return (cur.dept === '' || cur.dept === undefined) ? withSelection : withoutSelection;

}


export default AddAccount;