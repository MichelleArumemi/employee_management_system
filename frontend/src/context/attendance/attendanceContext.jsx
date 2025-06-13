import React, { createContext, useReducer } from 'react';
import axios from 'axios';

const AttendanceContext = createContext();

const initialState = {
  attendance: [],
  loading: false,
  error: null,
};

function attendanceReducer(state, action) {
  switch (action.type) {
    case 'SET_ATTENDANCE':
      return { ...state, attendance: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const AttendanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(attendanceReducer, initialState);

  // Fetch attendance records (optionally by date/user)
  const getAttendance = async (params = {}) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      let query = '';
      if (params.date) {
        query += `?date=${params.date}`;
      }
      if (params.userId) {
        query += `${query ? '&' : '?'}userId=${params.userId}`;
      }
      const res = await axios.get(`/api/attendance${query}`);
      dispatch({ type: 'SET_ATTENDANCE', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Update attendance record
  const updateAttendance = async (id, data) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.patch(`/api/attendance/${id}`, data);
    await getAttendance();
  };

  // Mark attendance (for employee check-in/out)
  const markAttendance = async (data) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.post('/api/attendance', data);
    await getAttendance();
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance: state.attendance,
        loading: state.loading,
        error: state.error,
        getAttendance,
        updateAttendance,
        markAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;
