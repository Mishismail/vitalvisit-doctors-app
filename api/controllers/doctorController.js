const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

/**
 * Controller to handle doctor application
 */
const applyDoctorController = async (req, res) => {
  try {
    // Create a new doctor with status 'pending'
    const newDoctor = new doctorModel({
      ...req.body,
      userId: req.body.userId,
      status: "pending"
    });
    await newDoctor.save();

    // Find the admin user
    const adminUser = await userModel.findOne({ isAdmin: true });
    if (!adminUser) {
      throw new Error("Admin user not found");
    }

    // Add a notification for the admin user
    const notification = adminUser.notification || [];
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a Doctor Account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });

    // Send success response
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied Successfully",
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Applying For Doctor",
      error: error.message,
    });
  }
};

/**
 * Controller to get doctor information by user ID
 */
const getDoctorInfoController = async (req, res) => {
  try {
    // Fetch doctor information using user ID
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor Data Fetch Success",
      data: doctor,
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Fetching Doctor Details",
    });
  }
};

/**
 * Controller to update doctor profile
 */
const updateProfileController = async (req, res) => {
  try {
    // Update doctor profile using user ID
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body,
      { new: true }
    );
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update Issue",
      error: error.message,
    });
  }
};

/**
 * Controller to get a single doctor by doctor ID
 */
const getDoctorByIdController = async (req, res) => {
  try {
    // Fetch doctor information using doctor ID from request parameters
    const doctor = await doctorModel.findById(req.params.id);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    // Log and send error response
    console.log("Error in getDoctorByIdController:", error);
    res.status(500).send({
      success: false,
      error: error.message,
      message: "Error in Single Doctor Info",
    });
  }
};

/**
 * Controller to get appointments for a doctor
 */
const doctorAppointmentsController = async (req, res) => {
  try {
    // Fetch doctor information using user ID
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Fetch appointments for the doctor
    const appointments = await appointmentModel.find({ doctorId: doctor._id }).populate('userId', 'name');
    res.status(200).json({
      success: true,
      message: "Doctor Appointments Fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error In Doctor Appointments",
      error: error.message,
    });
  }
};

/**
 * Controller to update the status of an appointment
 */
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;

    // Update appointment status
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status },
      { new: true }
    );

    // Find the user associated with the appointment and add a notification
    const user = await userModel.findOne({ _id: appointment.userId });
    let notification = user.notification || [];
    notification.push({
      type: "status-updated",
      message: `Your Appointment Has Been Updated to ${status}`,
      onClickPath: "/doctor-appointments",
    });
    await userModel.updateOne(
      { _id: user._id },
      { $set: { notification: notification } }
    );

    // Send success response
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error In Update Status",
    });
  }
};

module.exports = {
  applyDoctorController,
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
};




