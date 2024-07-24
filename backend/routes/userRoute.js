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

// Routes
router.post("/login", loginController);
router.post("/register", registerController);
router.post("/getUserData", authMiddleware, authController);
router.post("/apply-doctor", authMiddleware, roleMiddleware(['user']), applyDoctorController);
router.post("/get-all-notification", authMiddleware, getAllNotificationController);
router.post("/delete-all-notification", authMiddleware, deleteAllNotificationController);
router.get("/getAllDoctors", authMiddleware, roleMiddleware(['user', 'doctor', 'admin']), getAllDoctorsController);
router.post("/book-appointment", authMiddleware, roleMiddleware(['user']), bookAppointmentController);
router.post("/booking-availability", authMiddleware, roleMiddleware(['user']), bookingAvailabilityController);
router.get("/user-appointments", authMiddleware, roleMiddleware(['user']), userAppointmentsController);

console.log("Routes defined.");

module.exports = router;

