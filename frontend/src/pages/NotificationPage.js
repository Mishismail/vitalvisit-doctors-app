// NotificationPage.js

import { message, Tabs } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import Layout from "../components/Layout";

// NotificationPage component to handle user notifications
const NotificationPage = () => {
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { user } = useSelector((state) => state.user); // Get user information from the Redux store
  const [refreshNotifications, setRefreshNotifications] = useState(false); // State to trigger refresh of notifications

  // Function to mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading()); // Show loading indicator
      const res = await axios.post(
        "/api/user/get-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator
      if (res.data.success) {
        const unreadNotifications = res.data.notifications
          ? res.data.notifications.filter((notification) => !notification.isRead)
          : [];
        updateNotificationsInStore(unreadNotifications); // Update notifications in Redux store
        setRefreshNotifications(!refreshNotifications); // Toggle refresh state
        window.location.reload(); // Reload the page
        message.success(res.data.message); // Show success message
      } else {
        message.error(res.data.message); // Show error message
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator
      console.log(error); // Log error
      message.error("Something Went Wrong"); // Show error message
    }
  };

  // Function to delete all read notifications
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading()); // Show loading indicator
      const res = await axios.post(
        "/api/user/delete-all-notification",
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator
      if (res.data.success) {
        const updatedNotifications = res.data.notifications || [];
        const updatedUser = {
          ...user,
          notification: updatedNotifications.filter((notification) => !notification.isRead),
          seennotification: updatedNotifications.filter((notification) => notification.isRead),
        };
        dispatch(setUser(updatedUser)); // Update user in Redux store
        setRefreshNotifications(!refreshNotifications); // Toggle refresh state
        message.success(res.data.message); // Show success message
      } else {
        message.error(res.data.message); // Show error message
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator
      console.log(error); // Log error
      message.error("Something Went Wrong"); // Show error message
    }
  };

  // Function to update notifications in the Redux store
  const updateNotificationsInStore = (notifications) => {
    const updatedUser = {
      ...user,
      notification: [],
      seennotification: [],
    };
    notifications.forEach((notification) => {
      if (notification.isRead) {
        updatedUser.seennotification.push(notification);
      } else {
        updatedUser.notification.push(notification);
      }
    });
    dispatch(setUser(updatedUser)); // Update user in Redux store
  };

  const newNotifications = user?.notification || []; // Get new notifications
  const seenNotifications = user?.seennotification || []; // Get seen notifications

  // Tabs items configuration
  const items = [
    {
      key: 'new',
      label: 'New',
      children: (
        <>
          <div className="d-flex justify-content-end">
            <button
              className="p-1 btn btn-warning"
              style={{ cursor: "pointer" }}
              onClick={handleMarkAllRead}
            >
              Mark All Read
            </button>
          </div>
          {newNotifications.length > 0 ? (
            newNotifications.map((notificationMgs) => (
              <div
                className="card"
                style={{ cursor: "pointer" }}
                key={notificationMgs._id || notificationMgs.createdAt}
              >
                <div
                  className="card-text"
                  onClick={() => {
                    navigate(notificationMgs.onClickPath);
                  }}
                >
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <p>You have no new notifications.</p>
          )}
        </>
      ),
    },
    {
      key: 'read',
      label: 'Read',
      children: (
        <>
          <div className="d-flex justify-content-end">
            <button
              className="p-1 btn btn-danger"
              style={{ cursor: "pointer" }}
              onClick={handleDeleteAllRead}
            >
              Delete All Read
            </button>
          </div>
          {seenNotifications.length > 0 ? (
            seenNotifications.map((notificationMgs) => (
              <div
                className="card"
                style={{ cursor: "pointer" }}
                key={notificationMgs._id || notificationMgs.createdAt}
              >
                <div
                  className="card-text"
                  onClick={() => navigate(notificationMgs.onClickPath)}
                >
                  {notificationMgs.message}
                </div>
              </div>
            ))
          ) : (
            <p>You have no read notifications</p>
          )}
        </>
      ),
    },
  ];

  // Render the component
  return (
    <Layout>
      <h3 className="p-3 text-center">Notifications</h3> {/* Heading for notifications page */}
      <Tabs items={items} /> {/* Tabs to switch between new and read notifications */}
    </Layout>
  );
};

export default NotificationPage; // Export the NotificationPage component as the default export

