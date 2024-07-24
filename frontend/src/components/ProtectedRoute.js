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
        setRedirect("/login");
        setIsAuthChecked(true);
        return;
      }

      try {
        dispatch(showLoading());
        const { data } = await axios.post(
          "/api/user/getUserData",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(hideLoading());
        console.log("User Data:", data);
        if (data.success) {
          dispatch(setUser(data.data));
        } else {
          localStorage.clear();
          setRedirect("/login");
        }
      } catch (error) {
        localStorage.clear();
        dispatch(hideLoading());
        setRedirect("/login");
        console.log(error);
      } finally {
        setIsAuthChecked(true);
      }
    };

    if (!user) {
      getUser();
    } else {
      setIsAuthChecked(true);
    }
  }, [user, dispatch]);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (!isAuthChecked) {
    return <div>Loading...</div>; // or a loading spinner
  }

  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }

  if (user && roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}