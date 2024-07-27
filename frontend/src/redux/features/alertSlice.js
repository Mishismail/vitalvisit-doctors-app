//alertSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Slice for managing alerts and user notifications
export const alertSlice = createSlice({
  name: "alerts",
  initialState: {
    loading: false, // State to manage loading indicator
    user: {
      notification: [], // State to store user notifications
      seennotification: [], // State to store seen notifications
    },
  },
  reducers: {
    // Action to show loading indicator
    showLoading: (state) => {
      state.loading = true;
    },
    // Action to hide loading indicator
    hideLoading: (state) => {
      state.loading = false;
    },
    // Action to set user notifications
    setUserNotification: (state, action) => {
      state.user.notification = action.payload;
    },
    // Action to set seen notifications
    setSeenNotification: (state, action) => {
      state.user.seennotification = action.payload;
    },
  },
});

// Exporting actions to be used in components
export const {
  showLoading,
  hideLoading,
  setUserNotification,
  setSeenNotification,
} = alertSlice.actions;

export default alertSlice.reducer; // Exporting the reducer to be used in the store

