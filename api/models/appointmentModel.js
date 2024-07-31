// appointmentModel.js

const Joi = require('joi');
const mongoose = require('mongoose');

// Define the schema for an appointment
const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    doctorInfo: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'pending',
    },
    time: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Define a Joi schema for appointment validation
const appointmentJoiSchema = Joi.object({
  userId: Joi.string().required(),
  doctorId: Joi.string().required(),
  doctorInfo: Joi.object().required(),
  userInfo: Joi.object().required(),
  date: Joi.date().required(),
  status: Joi.string().valid('pending', 'approved', 'rejected').default('pending'),
  time: Joi.string().required(),
  reason: Joi.string().required(),
}).options({ stripUnknown: true });

// Create a Mongoose model for appointments
const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

// Add the Joi validation method to the Mongoose model
AppointmentModel.validateAppointment = async function (appointment) {
  return appointmentJoiSchema.validateAsync(appointment);
};

module.exports = AppointmentModel;
