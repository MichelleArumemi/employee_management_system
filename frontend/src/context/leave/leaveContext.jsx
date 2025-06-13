import React from 'react';
import { createContext, useReducer } from 'react';
import axios from 'axios';

const LeaveContext = createContext();

const initialState = {
  leaves: [],
  loading: false,
  error: null,
};

function leaveReducer(state, action) {
  switch (action.type) {
    case 'SET_LEAVES':
      return { ...state, leaves: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const LeaveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leaveReducer, initialState);

  // Fetch all leaves (optionally by user)
  const getLeaves = async (userId = null) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      let url = '/api/leaves';
      if (userId) url += `?userId=${userId}`;
      const res = await axios.get(url);
      dispatch({ type: 'SET_LEAVES', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Apply for leave (employee)
  const applyLeave = async (leaveData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.post('/api/leaves', leaveData);
      await getLeaves(leaveData.employee); // Optionally pass employee ID
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Approve or reject leave (admin)
  const approveLeave = async (leaveId, status) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.patch(`/api/leaves/${leaveId}`, { status });
      await getLeaves();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        leaves: state.leaves,
        loading: state.loading,
        error: state.error,
        getLeaves,
        applyLeave,
        approveLeave,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export default LeaveContext;