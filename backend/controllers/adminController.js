const doctorModel = require('../models/doctorModel');
const userModel = require("../models/userModel");

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users Data List",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Fetching Users",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: { $in: ["approved", "pending"] } });
    res.status(200).send({
      success: true,
      message: "Doctors Data List",
      data: doctors,
    });
  } catch (error) {
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


const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status }, { new: true });

    if (!doctor || !doctor.userId) {
      return res.status(400).send({
        success: false,
        message: "Doctor or Doctor's User ID not found",
      });
    }

    const user = await userModel.findOne({ _id: doctor.userId });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const notification = user.notification || [];
    notification.push({
      type: "doctor-account-request-updated",
      message: `Your Doctor Account Request Has ${status}`,
      onClickPath: "/notification",
    });

    user.isDoctor = status === "approved";
    user.notification = notification;
    await user.save();

    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Account Status",
      error,
    });
  }
};

const blockUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isBlocked: true, blockedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

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
    console.log(error);
    res.status(500).send({ success: false, message: "Error Blocking User", error });
  }
};

const unblockUserController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { isBlocked: false, blockedAt: null },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    res.status(200).send({ success: true, message: "User Unblocked Successfully", data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Error Unblocking User", error });
  }
};

module.exports = {
  blockUserController,
  unblockUserController, // Add this line
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
};