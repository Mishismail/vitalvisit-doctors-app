// doctorRoute.js

const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
} = require("../controllers/doctorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Define routes with corresponding controllers and middlewares
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController); // Get doctor information
router.post("/updateProfile", authMiddleware, updateProfileController); // Update doctor profile
router.post("/getDoctorById/:id", authMiddleware, getDoctorByIdController); // Get a doctor by ID
router.get("/doctor-appointments", authMiddleware, doctorAppointmentsController); // Get doctor appointments
router.post("/update-status", authMiddleware, updateStatusController); // Update appointment status

module.exports = router;
