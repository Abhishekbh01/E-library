import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  
  // Check if the current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Only set loading to false after we've checked the user's role
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is not an admin but trying to access admin routes
  if (isAdminRoute && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // If user is an admin but trying to access non-admin routes
  if (!isAdminRoute && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
