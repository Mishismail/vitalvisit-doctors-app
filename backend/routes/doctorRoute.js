// doctorRoute.js

const express = require("express");
const {
  applyDoctorController,
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Define routes with corresponding controllers and middlewares
router.post("/apply-doctor", authMiddleware, applyDoctorController); // Apply for a doctor account
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController); // Get doctor information
router.post("/updateProfile", authMiddleware, updateProfileController); // Update doctor profile
router.post("/getDoctorById", authMiddleware, getDoctorByIdController); // Get a doctor by ID
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController); // Get doctor appointments
router.post("/update-status", authMiddleware, updateStatusController); // Update appointment status

module.exports = router;
