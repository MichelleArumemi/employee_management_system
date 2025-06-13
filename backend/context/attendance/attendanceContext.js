import { createContext, useReducer } from 'react';
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
      const res = await axios.get(`/api/v1/attendance${query}`);
      dispatch({ type: 'SET_ATTENDANCE', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Employee: Clock in
  const clockIn = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.post('/api/v1/attendance/clockin');
      await getAttendance();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Employee: Clock out
  const clockOut = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.post('/api/v1/attendance/clockout');
      await getAttendance();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Admin: Update attendance record
  const updateAttendance = async (id, data) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      await axios.patch(`/api/v1/attendance/${id}`, data);
      await getAttendance();
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance: state.attendance,
        loading: state.loading,
        error: state.error,
        getAttendance,
        clockIn,
        clockOut,
        updateAttendance,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;