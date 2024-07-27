import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children, roles }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [redirect, setRedirect] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      console.log("Stored Token:", token);
      if (!token) {
        // No token found, redirect to login
        setRedirect("/login");
        setIsAuthChecked(true);
        return;
      }

      try {
        // Show loading indicator
        dispatch(showLoading());
        // Fetch user data with the token
        const { data } = await axios.post(
          "/api/user/getUserData",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Hide loading indicator
        dispatch(hideLoading());
        console.log("User Data:", data);
        if (data.success) {
          // Set user data in the Redux store
          dispatch(setUser(data.data));
        } else {
          // Clear local storage and redirect to login if fetching user data fails
          localStorage.clear();
          setRedirect("/login");
        }
      } catch (error) {
        // Handle errors, clear local storage, hide loading, and redirect to login
        localStorage.clear();
        dispatch(hideLoading());
        setRedirect("/login");
        console.log(error);
      } finally {
        // Mark authentication check as complete
        setIsAuthChecked(true);
      }
    };

    if (!user) {
      // Fetch user data if not already available
      getUser();
    } else {
      // Mark authentication check as complete if user data is already available
      setIsAuthChecked(true);
    }
  }, [user, dispatch]);

  if (redirect) {
    // Redirect to the specified route if needed
    return <Navigate to={redirect} />;
  }

  if (!isAuthChecked) {
    // Show loading indicator while authentication check is in progress
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!localStorage.getItem("token")) {
    // Redirect to login if no token is found
    return <Navigate to="/login" />;
  }

  if (user && roles && !roles.includes(user.role)) {
    // Redirect to home if user does not have the required role
    return <Navigate to="/" />;
  }

  // Render the children components if all checks pass
  return children;
}