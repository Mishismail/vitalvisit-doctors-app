// userSlice.js

import { createSlice } from "@reduxjs/toolkit";

// Slice for managing user state
export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // State to store user information
  },
  reducers: {
    // Action to set user information
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

// Exporting actions to be used in components
export const { setUser } = userSlice.actions;