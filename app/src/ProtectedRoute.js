import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from './AuthContext'; // Adjust the path as needed


const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext); // Assuming 'user' determines authentication

  // Determine if the user is authenticated
  const isAuthenticated = user != null;

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;