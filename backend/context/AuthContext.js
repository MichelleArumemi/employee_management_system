// import { createContext, useContext, useState } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Function to load user from localStorage if a token exists
//   const loadUserFromToken = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // You might want to have an API endpoint to verify the token
//       // and fetch user details, or decode the token if it's a JWT
//       try {
//         setLoading(true);
//         const response = await axios.get('/api/auth/me', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setUser(response.data.user);
//       } catch (error) {
//         console.error('Failed to load user from token:', error);
//         localStorage.removeItem('token'); // Clear invalid token
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     }
//   };

//   // Login function, now accepting an optional role
//   const login = async (email, password, role) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('/api/auth/login', { email, password, role }); // Pass role to API
//       setUser(response.data.user);
//       localStorage.setItem('token', response.data.token);
//       setLoading(false);
//       return response.data;
//     } catch (error) {
//       setLoading(false);
//       throw new Error(error.response?.data?.message || 'Login failed');
//     }
//   };

//   // Signup function remains largely the same, as userData already includes role
//   const signup = async (userData) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('/api/auth/signup', userData);
//       setLoading(false);
//       return response.data;
//     } catch (error) {
//       setLoading(false);
//       throw new Error(error.response?.data?.message || 'Signup failed');
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//   // Optional: Add a useEffect to load user on initial mount
//   // This helps persist login state across page refreshes
//   // import { useEffect } from 'react';
//   // useEffect(() => {
//   //   loadUserFromToken();
//   // }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);