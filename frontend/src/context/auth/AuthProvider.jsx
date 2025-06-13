import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      // Make API call to your backend login endpoint
      const response = await axios.post('/api/v1/auth/login', credentials);
      
      const { user, token, role } = response.data;
      
      // Store token in localStorage (optional)
      if (token) {
        localStorage.setItem('token', token);
        // Set default authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Update state
      setUser(user);
      setRole(role);
      setLoading(false);
      
      return { success: true, user, role };
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Optional: Call backend logout endpoint
      await axios.post('/api/v1/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      
      // Remove authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      // Reset state
      setUser(null);
      setRole(null);
      setError(null);
    }
  };

  // Register function (bonus)
  const employeesignup = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/v1/auth/employeesignup', userData);
      const { user, token, role } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      setUser(user);
      setRole(role);
      setLoading(false);
      
      return { success: true, user, role };
    } catch (err) {
      setError(err.response?.data?.message || 'Sign Up failed');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Sign Up failed' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return user !== null;
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return role === requiredRole;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      role, 
      setRole,
      loading,
      error,
      login,
      logout,
      employeesignup,
      isAuthenticated,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;