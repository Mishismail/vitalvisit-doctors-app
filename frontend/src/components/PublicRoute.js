//PublicRoute.js

import React from "react"; // Import React library
import { useSelector } from "react-redux"; // Import useSelector hook from react-redux to access the Redux store
import { Navigate } from "react-router-dom"; // Import Navigate component from react-router-dom for navigation

/**
 * PublicRoute component
 * This component is used to restrict access to certain routes based on user authentication status.
 * If the user is authenticated, they are redirected to the home page.
 * If the user is not authenticated, they are allowed to access the children components.
 */
const PublicRoute = ({ children }) => {
  // Access the user state from the Redux store
  const { user } = useSelector((state) => state.user);

  // If the user is authenticated, redirect to the home page
  if (user) {
    return <Navigate to="/" />;
  }

  // If the user is not authenticated, render the children components
  return children;
};

export default PublicRoute; // Export the PublicRoute component as the default export