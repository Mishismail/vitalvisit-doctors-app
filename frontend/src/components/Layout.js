//Layout.js

import { Badge, message } from "antd";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../data/data";
import { setUser } from "../redux/features/userSlice";
import { MedicineBoxOutlined } from '@ant-design/icons'; // Import the desired icon

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user); // Get user information from Redux store.
  const location = useLocation(); // Hook to get the current location.
  const navigate = useNavigate(); // Hook to navigate programmatically.
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store.

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.clear(); // Clear local storage
    dispatch(setUser(null)); // Clear the user state in Redux
    message.success("Logout Successfully"); // Display success message
    navigate("/login"); // Navigate to login page
  };

  // Define menu items for doctors
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "fa-solid fa-user",
    },
  ];

  // Determine which menu to display based on user role
  const SidebarMenu = user?.role === "admin"
    ? adminMenu
    : user?.role === "doctor"
    ? doctorMenu
    : userMenu;

  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6><b><MedicineBoxOutlined style={{ marginRight: '8px' }} /> Vital Visit</b></h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <div
                    key={menu.name}
                    className={`menu-item ${isActive && "active"}`}
                  >
                    <i className={menu.icon}></i>
                    <Link to={menu.path}>{menu.name}</Link>
                  </div>
                );
              })}
              <div className="menu-item" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Logout</span>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div className="header-content" style={{ cursor: "pointer" }}>
                <Badge
                  count={
                    user && user.notification ? user.notification.length : 0
                  }
                  onClick={() => {
                    navigate("/notification");
                  }}
                >
                  <i className="fa-solid fa-bell"></i>
                </Badge>
              </div>
              <div className="user-doctor-admin-name">
                <h5>{user?.name}</h5>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;

