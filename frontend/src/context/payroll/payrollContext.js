import React, { createContext, useState } from 'react';

export const PayrollContext = createContext();

export const PayrollProvider = ({ children }) => {
  const [payroll, setPayroll] = useState([]);

  // Add payroll logic here

  return (
    <PayrollContext.Provider value={{ payroll, setPayroll }}>
      {children}
    </PayrollContext.Provider>
  );
};
