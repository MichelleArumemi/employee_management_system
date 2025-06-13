import React, { createContext, useReducer } from 'react';
import axios from 'axios';

const PayrollContext = createContext();

const initialState = {
  payroll: [],
  loading: false,
  error: null,
};

function payrollReducer(state, action) {
  switch (action.type) {
    case 'SET_PAYROLL':
      return { ...state, payroll: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const PayrollProvider = ({ children }) => {
  const [state, dispatch] = useReducer(payrollReducer, initialState);

  // Fetch payroll records (optionally by month/year/employee)
  const getPayroll = async (params = {}) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      let query = '';
      if (params.month && params.year) {
        query = `?month=${params.month}&year=${params.year}`;
      }
      if (params.employeeId) {
        query += `${query ? '&' : '?'}employeeId=${params.employeeId}`;
      }
      const res = await axios.get(`/api/payroll${query}`);
      dispatch({ type: 'SET_PAYROLL', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Create a new payroll record
  const createPayroll = async (data) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.post('/api/payroll', data);
    await getPayroll();
  };

  // Update a payroll record
  const updatePayroll = async (id, data) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.patch(`/api/payroll/${id}`, data);
    await getPayroll();
  };

  // Delete a payroll record
  const deletePayroll = async (id) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.delete(`/api/payroll/${id}`);
    await getPayroll();
  };

  // Generate payslip (dummy, adjust as needed)
  const generatePayslip = async (id) => {
    await axios.post(`/api/payroll/${id}/generate-payslip`);
    await getPayroll();
  };

  return (
    <PayrollContext.Provider
      value={{
        payroll: state.payroll,
        loading: state.loading,
        error: state.error,
        getPayroll,
        createPayroll,
        updatePayroll,
        deletePayroll,
        generatePayslip,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};

export default PayrollContext;
