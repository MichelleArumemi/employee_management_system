import React, { createContext, useState } from 'react';

export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);

  // Add leave logic here

  return (
    <LeaveContext.Provider value={{ leaves, setLeaves }}>
      {children}
    </LeaveContext.Provider>
  );
};
