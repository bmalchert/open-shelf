// client/src/components/routing/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Improved loading state with a more user-friendly message
  if (loading) {
    return (
      <div className="private-route-loading">
        <h2>Loading your account...</h2>
        <p>Please wait while we verify your credentials.</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;