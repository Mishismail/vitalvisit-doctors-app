// userController.js

const bcrypt = require("bcryptjs");
const userModel = require('../models/userModel');
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const jwt = require("jsonwebtoken");
const moment = require("moment");

/**
 * Register a new user or doctor
 */
const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      starttime,
      endtime
    } = req.body;

    console.log("Register request body:", req.body);

    // Validate role
    const validRoles = ["user", "doctor", "admin"];
    if (!validRoles.includes(role)) {
      console.log("Invalid role:", role);
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash and salt password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // If role is doctor, create doctor profile
    if (role === "doctor") {
      if (!phone || !address || !specialization || !experience || !feesPerConsultation || !starttime || !endtime) {
        console.log("Missing required fields for doctor registration");
        return res.status(400).json({
          success: false,
          message: "Missing required fields for doctor registration",
        });
      }

      const newDoctor = new doctorModel({
        userId: newUser._id, // Link to user
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1] || "",
        phone,
        email,
        website,
        address,
        specialization,
        experience,
        feesPerConsultation,
        starttime,
        endtime,
        status: "pending" // Set initial status to pending
      });

      await newDoctor.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      success: true,
      token, // Send token upon registration
      user: { ...newUser._doc, password: undefined }, // Exclude password from response
    });
  } catch (error) {
    console.log("Error in registration:", error.message);
    res.status(400).json({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
};

/**
 * Login user
 */
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (!user) {
      // Check if the email belongs to a doctor
      const doctor = await doctorModel.findOne({ email });
      if (doctor) {
        user = await userModel.findById(doctor.userId);
      }
      if (!user) {
        return res.status(404).send('User Not Found');
      }
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send('Invalid Password');
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
  }
};

/**
 * Authenticate user
 */
const authController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      user.password = undefined;
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

/**
 * Apply for a doctor account
 */
const applyDoctorController = async (req, res) => {
  try {
    const {
      userId,
      email,
      phone,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      starttime,
      endtime,
      firstName,
      lastName,
      password,
    } = req.body;

    // Find the user
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Update user password and role
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword;
    user.role = 'doctor';
    await user.save();

    // Create a doctor profile
    const newDoctor = new doctorModel({
      userId,
      firstName,
      lastName,
      phone,
      email,
      website,
      address,
      specialization,
      experience,
      feesPerConsultation,
      starttime,
      endtime,
      status: "pending",
    });

    await newDoctor.save();

    // Add notifications for the user
    user.notification.push({
      type: "apply-doctor-request",
      message: `Your application for a Doctor Account has been received.`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
    });

    // Notify admin
    const adminUser = await userModel.findOne({ role: "admin" });
    if (adminUser) {
      adminUser.notification.push({
        type: "apply-doctor-request",
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account.`,
        data: {
          doctorId: newDoctor._id,
          name: newDoctor.firstName + " " + newDoctor.lastName,
        },
      });
      await adminUser.save();
    }

    // Save user details
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
      token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Applying For Doctor",
      error: error.message,
    });
  }
};

/**
 * Get all notifications for a user
 */
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = seennotification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "All Notifications Marked As Read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error In Notification",
      success: false,
      error,
    });
  }
};

/**
 * Delete all notifications for a user
 */
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findById(req.body.userId);
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable To Delete All Notifications",
      error,
    });
  }
};

/**
 * Get all approved doctors
 */
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors Lists Fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While Fetching Doctor",
    });
  }
};

/**
 * Check booking availability
 */
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const startTime = moment(req.body.time, "HH:mm").toISOString();
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor not found",
        success: false,
      });
    }
    const start = moment(doctor.starttime, "HH:mm").toISOString();
    const end = moment(doctor.endtime, "HH:mm").toISOString();
    if (!moment(startTime).isBetween(start, end, undefined, "[]")) {
      return res.status(200).send({
        message: "Appointment Not Available",
        success: false,
      });
    }
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: startTime,
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointment Not Available",
        success: false,
      });
    }
    return res.status(200).send({
      success: true,
      message: "Appointment Available",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Checking Appointment Availability",
    });
  }
};

/**
 * Book an appointment
 */
const bookAppointmentController = async (req, res) => {
  try {
    const { date, time, doctorId, userId, doctorInfo, userInfo, reason } = req.body;

    if (!date || !time || !doctorId || !userId || !reason) {
      return res.status(400).send({
        message: "Missing required fields",
        success: false,
      });
    }

    const dateFormatted = moment(date, "YYYY-MM-DD").toISOString();
    const startTime = moment(time, "HH:mm").toISOString();

    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).send({
        message: "Doctor Not Found",
        success: false,
      });
    }

    const start = moment(doctor.starttime, "HH:mm").toISOString();
    const end = moment(doctor.endtime, "HH:mm").toISOString();

    if (!moment(startTime).isBetween(start, end, undefined, "[]")) {
      return res.status(400).send({
        message: "Selected Time Is Not Within Doctor's Available Range",
        success: false,
      });
    }

    const appointments = await appointmentModel.find({
      doctorId,
      date: dateFormatted,
      status: "approved",
    });

    if (appointments.length >= doctor.maxPatientsPerDay) {
      return res.status(400).send({
        message: "Maximum Number Of Appointments Reached For This Day",
        success: false,
      });
    }

    const existingAppointment = await appointmentModel.findOne({
      doctorId,
      date: dateFormatted,
      time: startTime,
      status: "approved",
    });

    if (existingAppointment) {
      return res.status(400).send({
        message: "Appointment Already Booked For This Time Slot",
        success: false,
      });
    }

    const newAppointment = new appointmentModel({
      doctorId,
      userId,
      date: dateFormatted,
      time: startTime,
      doctorInfo,
      userInfo,
      reason,
    });

    await newAppointment.save();

    return res.status(200).send({
      success: true,
      message: "Appointment Booked Successfully",
    });
  } catch (error) {
    console.log("Error in booking appointment:", error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Booking Appointment",
    });
  }
};

/**
 * Get all appointments for a user
 */
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    }).populate('doctorId', 'firstName lastName');
    res.status(200).send({
      success: true,
      message: "Users Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In User Appointments",
    });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController
};