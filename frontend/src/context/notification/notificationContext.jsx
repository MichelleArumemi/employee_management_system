import React from 'react'
import { createContext, useReducer } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

function notificationReducer(state, action) {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Fetch notifications (optionally by user)
  const getNotifications = async (userId = null) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      let url = '/api/notifications';
      if (userId) url += `?userId=${userId}`;
      const res = await axios.get(url);
      dispatch({ type: 'SET_NOTIFICATIONS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.patch(`/api/notifications/${notificationId}/read`);
    await getNotifications();
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.delete(`/api/notifications/${notificationId}`);
    await getNotifications();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        loading: state.loading,
        error: state.error,
        getNotifications,
        markAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
