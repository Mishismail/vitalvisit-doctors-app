// store.js

import { configureStore } from "@reduxjs/toolkit";
import { alertSlice } from "./features/alertSlice";
import { userSlice } from "./features/userSlice";

// Configuring the Redux store with alert and user slices
export default configureStore({
  reducer: {
    alerts: alertSlice.reducer, // Reducer for alert slice
    user: userSlice.reducer, // Reducer for user slice
  },
});
