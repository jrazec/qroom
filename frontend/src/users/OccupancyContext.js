import React, { createContext, useContext, useState } from "react";

// Create the OccupancyContext
const OccupancyContext = createContext();

// OccupancyProvider that wraps your components
export const OccupancyProvider = ({ children }) => {
  const [occupiedRoom, setOccupiedRoom] = useState(null);

  const occupyRoom = (room) => {
    setOccupiedRoom(room);
  };

  const unoccupyRoom = () => {
    setOccupiedRoom(null);
  };

  return (
    <OccupancyContext.Provider value={{ occupiedRoom, occupyRoom, unoccupyRoom }}>
      {children}
    </OccupancyContext.Provider>
  );
};

// Custom hook to use the occupancy context
export const useOccupancy = () => {
  const context = useContext(OccupancyContext);
  if (!context) {
    throw new Error("useOccupancy must be used within an OccupancyProvider");
  }
  return context;
};
