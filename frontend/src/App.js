//App.js

import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Spinner from "./components/Spinner";
import ApplyDoctor from "./pages/ApplyDoctor";
import Appointments from "./pages/Appointments";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import NotificationPage from "./pages/NotificationPage";
import Register from "./pages/Register";
import Doctors from "./pages/admin/Doctors";
import Users from "./pages/admin/Users";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import Profile from "./pages/doctor/Profile";

// Main App component
function App() {
  const { loading } = useSelector((state) => state.alerts); // Get loading state from Redux store

  // Render the component
  return (
    <>
      <BrowserRouter>
        {loading ? (
          <Spinner /> // Show Spinner component if loading is true
        ) : (
          <Routes>
            {/* Protected routes for different roles */}
            <Route
              path="/"
              element={
                <ProtectedRoute roles={['user', 'doctor', 'admin']}>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/apply-doctor"
              element={
                <ProtectedRoute roles={['user']}>
                  <ApplyDoctor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/doctors"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Doctors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor/profile/:id"
              element={
                <ProtectedRoute roles={['doctor']}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute roles={['user']}>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-appointments"
              element={
                <ProtectedRoute roles={['doctor']}>
                  <DoctorAppointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification"
              element={
                <ProtectedRoute roles={['user', 'doctor', 'admin']}>
                  <NotificationPage />
                </ProtectedRoute>
              }
            />
            {/* Public routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App; // Export the App component as the default export