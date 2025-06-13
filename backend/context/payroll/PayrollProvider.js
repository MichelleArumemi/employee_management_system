// import React, { useState } from "react";
// import PayrollContext from "./PayrollContext";
// import axios from "axios";

// const API_URL = "http://localhost:5000/api/payroll"; // adjust as needed

// const PayrollProvider = ({ children }) => {
//   const [payroll, setPayroll] = useState([]);

//   // Fetch payroll based on filters
//   const getPayroll = async ({ month, year, employeeId }) => {
//     let query = `?month=${month}&year=${year}`;
//     if (employeeId) query += `&employee=${employeeId}`;
//     const res = await axios.get(`${API_URL}${query}`);
//     setPayroll(res.data);
//   };

//   // Create new payroll record
//   const createPayroll = async (data) => {
//     const res = await axios.post(API_URL, data);
//     setPayroll(prev => [res.data, ...prev]);
//   };

//   // Update existing payroll (e.g., status)
//   const updatePayroll = async (id, data) => {
//     const res = await axios.put(`${API_URL}/${id}`, data);
//     setPayroll(prev => prev.map(p => (p._id === id ? res.data : p)));
//   };

//   // Delete payroll record
//   const deletePayroll = async (id) => {
//     await axios.delete(`${API_URL}/${id}`);
//     setPayroll(prev => prev.filter(p => p._id !== id));
//   };

//   // Generate a payslip (dummy logic or backend PDF generation)
//   const generatePayslip = async (id) => {
//     await axios.post(`${API_URL}/${id}/generate-payslip`);
//     // refetch updated payslip URL
//     const res = await axios.get(`${API_URL}/${id}`);
//     setPayroll(prev =>
//       prev.map(p => (p._id === id ? res.data : p))
//     );
//   };

//   return (
//     <PayrollContext.Provider
//       value={{
//         payroll,
//         getPayroll,
//         createPayroll,
//         updatePayroll,
//         deletePayroll,
//         generatePayslip
//       }}
//     >
//       {children}
//     </PayrollContext.Provider>
//   );
// };

// export default PayrollProvider;
