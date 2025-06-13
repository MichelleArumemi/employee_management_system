import { createContext, useReducer } from 'react';
import axios from 'axios';

const UserContext = createContext();

const initialState = {
  users: [],
  loading: false,
  error: null,
};

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, users: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: true };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Fetch all users
  const getUsers = async () => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axios.get('/api/users');
      dispatch({ type: 'SET_USERS', payload: res.data.user || res.data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  };

  // Fetch user by ID
  const getUserById = async (id) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const res = await axios.get(`/api/users/${id}`);
      return res.data.user || res.data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
      return null;
    }
  };

  // Update user
  const updateUser = async (id, data) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.patch(`/api/users/editEmployee/${id}`, data);
    await getUsers();
  };

  // Delete user
  const deleteUser = async (id) => {
    dispatch({ type: 'SET_LOADING' });
    await axios.delete(`/api/users/${id}`);
    await getUsers();
  };

  return (
    <UserContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        error: state.error,
        getUsers,
        getUserById,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
