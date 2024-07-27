// userRoute.js

const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

console.log("Defining routes...");

// Define routes with corresponding controllers and middlewares
router.post("/login", loginController); // User login
router.post("/register", registerController); // User registration
router.post("/getUserData", authMiddleware, authController); // Get user data with authentication
router.post("/apply-doctor", authMiddleware, roleMiddleware(['user']), applyDoctorController); // Apply for a doctor account, only accessible by users
router.post("/get-all-notification", authMiddleware, getAllNotificationController); // Get all notifications for a user
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController); // Delete all notifications for a user
router.get("/getAllDoctors", authMiddleware, roleMiddleware(['user', 'doctor', 'admin']), getAllDoctorsController); // Get all doctors, accessible by users, doctors, and admins
router.post("/book-appointment", authMiddleware, roleMiddleware(['user']), bookAppointmentController); // Book an appointment, only accessible by users
router.post("/booking-availability", authMiddleware, roleMiddleware(['user']), bookingAvailabilityController); // Check booking availability, only accessible by users
router.get("/user-appointments", authMiddleware, roleMiddleware(['user']), userAppointmentsController); // Get user appointments, only accessible by users

console.log("Routes defined.");

module.exports = router;
