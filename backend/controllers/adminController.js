// adminController.js

const doctorModel = require('../models/doctorModel');
const userModel = require("../models/userModel");

/**
 * Controller to get all users
 */
const getAllUsersController = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await userModel.find({});
    // Send success response with user data
    res.status(200).send({
      success: true,
      message: "Users Data List",
      data: users,
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Fetching Users",
      error,
    });
  }
};

/**
 * Controller to get all doctors
 */
const getAllDoctorsController = async (req, res) => {
  try {
    // Fetch doctors with status 'approved' or 'pending' from the database
    const doctors = await doctorModel.find({ status: { $in: ["approved", "pending"] } });
    // Send success response with doctor data
    res.status(200).send({
      success: true,
      message: "Doctors Data List",
      data: doctors,
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Getting Doctors Data",
      error,
    });
  }
};

module.exports = {
  getAllDoctorsController,
};

/**
 * Controller to change the account status of a doctor
 */
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;

    // Update the status of the doctor
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status }, { new: true });

    if (!doctor || !doctor.userId) {
      return res.status(400).send({
        success: false,
        message: "Doctor or Doctor's User ID not found",
      });
    }

    // Find the associated user and update their notifications and doctor status
    const user = await userModel.findOne({ _id: doctor.userId });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    // Add notification about the account status update
    const notification = user.notification || [];
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });

    // Update user's doctor status
    user.isDoctor = status === "approved";
    user.notification = notification;
    await user.save();

    // Send success response with updated doctor data
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Account Status",
      error,
    });
  }
};

/**
 * Controller to block a user
 */
const blockUserController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Block the user and set the blockedAt date
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isBlocked: true, blockedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Send success response with blocked user data
    res.status(200).send({ success: true, message: "User Blocked Successfully", data: user });

    // Schedule user deletion after 24 hours
    setTimeout(async () => {
      const now = new Date();
      const userToDelete = await userModel.findById(userId);
      if (userToDelete && userToDelete.isBlocked && now - userToDelete.blockedAt >= 24 * 60 * 60 * 1000) {
        await userModel.findByIdAndDelete(userId);
        console.log(`User with ID ${userId} has been deleted.`);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({ success: false, message: "Error Blocking User", error });
  }
};

/**
 * Controller to unblock a user
 */
const unblockUserController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Unblock the user and reset the blockedAt date
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isBlocked: false, blockedAt: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Send success response with unblocked user data
    res.status(200).send({ success: true, message: "User Unblocked Successfully", data: user });
  } catch (error) {
    // Log and send error response
    console.log(error);
    res.status(500).send({ success: false, message: "Error Unblocking User", error });
  }
};

module.exports = {
  blockUserController,
  unblockUserController,
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
};