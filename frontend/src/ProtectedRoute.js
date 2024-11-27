import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdmin = false }) => {
  // Check for user token or admin token based on `isAdmin` prop
  const userToken = localStorage.getItem('token'); // User token
  const adminToken = localStorage.getItem('adminToken'); // Admin token

  // If `isAdmin` is true, check for the admin token, otherwise check for the user token
  if (isAdmin && !adminToken) {
    // If not an admin and there's no admin token, redirect to admin login
    return <Navigate to="/admin/login" />;
  } else if (!isAdmin && !userToken) {
    // If not an admin and there's no user token, redirect to user login
    return <Navigate to="/user/login" />;
  }

  // If the appropriate token exists, render the children (the protected content)
  return children;
};

export default ProtectedRoute;
