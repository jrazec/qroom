import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOccupancy } from "./OccupancyContext"; // Import the context

const UserOccupiedRoom = ({ userName }) => {
  const { occupiedRoom, occupyRoom, unoccupyRoom } = useOccupancy(); // Destructure occupyRoom and unoccupyRoom from context
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the room occupied by the current user only on mount
    if (!userName) {
      console.error("User name is missing. Cannot fetch occupied room.");
      setError("User name is missing. Cannot fetch occupied room.");
      return;
    }

    const fetchOccupiedRoom = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching occupied room for user name:", userName);

        const response = await axios.get(
          `${process.env.REACT_APP_LOCALHOST}/api/rooms/user-occupied-room/${userName}`
        );

        if (response.status === 200 && response.data) {
          // Update context state with the occupied room data
          occupyRoom(response.data);
        } else {
          console.warn("No occupied room found for user name:", userName);
          unoccupyRoom(); // Set to null when no room is occupied
        }
      } catch (err) {
        console.error("Error fetching occupied room:", err);
        setError("Failed to load your occupied room.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch the room on component mount
    fetchOccupiedRoom();
  }, []); // Empty dependency array means this effect only runs on mount

  // Handle the unoccupy action for the current user's room
  const handleUnoccupyRoom = async () => {
    if (!occupiedRoom) {
      return;
    }

    try {
      console.log("Attempting to unoccupy room:", occupiedRoom);

      const response = await axios.post(
        `${process.env.REACT_APP_LOCALHOST}/api/rooms/update-room-status`,
        {
          room_id: occupiedRoom.room_id,
          action: "unoccupy",
          user_name: userName, // Ensure we are providing the user_name to backend
        }
      );

      if (response.status === 200) {
        alert(`Successfully unoccupied room: ${occupiedRoom.room_name}`);
        unoccupyRoom(); // Update context after successful unoccupy
      } else {
        console.error("Failed to unoccupy room:", response.data.message);
        alert(`Failed to unoccupy room: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error unoccupying room:", error);
      alert("Failed to unoccupy room. Please try again later.");
    }
  };

  return (
    <div className="user-occupied-room-container">
      {loading ? (
        <p>Loading your occupied room...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : occupiedRoom ? (
        <div className="occupied-room-card">
          <h3>Your Occupied Room</h3>
          <p>Room Name: {occupiedRoom.room_name}</p>
          <button className="btn btn-danger" onClick={handleUnoccupyRoom}>
            Unoccupy Room
          </button>
        </div>
      ) : (
        <p>You have no occupied rooms.</p>
      )}
    </div>
  );
};

export default UserOccupiedRoom;
