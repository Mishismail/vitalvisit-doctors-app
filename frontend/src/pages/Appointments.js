//Appointments.js

import React, { useEffect, useState } from "react";
import { Table, DatePicker, TimePicker, message, Input, Button, Select } from "antd";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import Layout from "./../components/Layout";
import logError from "../utils/logError";  // Importing the custom logError function

// Function to get appointments
const getAppointments = async (setAppointments) => {
  try {
    const res = await axios.get("/api/user/user-appointments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.data.success) {
      setAppointments(res.data.data); // Set appointments state with fetched data
    }
  } catch (error) {
    logError(error);  // Using custom logError function
  }
};

// Function to get doctors
const getDoctors = async (setDoctors) => {
  try {
    const res = await axios.get("/api/user/getAllDoctors", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.data.success) {
      setDoctors(res.data.data); // Set doctors state with fetched data
    }
  } catch (error) {
    logError(error);  // Using custom logError function
  }
};

// Function to handle booking
const handleBooking = async (
  selectedDoctor,
  date,
  time,
  reason,
  doctors,
  user,
  dispatch,
  setAppointments
) => {
  try {
    if (!selectedDoctor || !date || !time || !reason) {
      return message.error("Please select doctor, date, time and enter reason for visit"); // Show error if any field is missing
    }
    dispatch(showLoading()); // Show loading indicator
    const doctor = doctors.find((doc) => doc._id === selectedDoctor);
    const res = await axios.post(
      "/api/user/booking-availability",
      {
        doctorId: selectedDoctor,
        date: date.format("YYYY-MM-DD"),
        time: time.format("HH:mm"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (res.data.success) {
      const bookingRes = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: selectedDoctor,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date.format("YYYY-MM-DD"),
          time: time.format("HH:mm"),
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator
      if (bookingRes.data.success) {
        message.success("Appointment booked successfully"); // Show success message
        getAppointments(setAppointments); // Refresh appointments list
      } else {
        message.error(bookingRes.data.message); // Show error message
      }
    } else {
      message.error("Appointment is not available. Please try another slot."); // Show error message
    }
  } catch (error) {
    dispatch(hideLoading()); // Hide loading indicator
    logError("Error during booking:", error);  // Using custom logError function
    message.error("Error during booking. Please try again."); // Show error message
  }
};

// Appointments component to handle booking and display appointments
const Appointments = () => {
  const [appointments, setAppointments] = useState([]); // State to store appointments
  const [doctors, setDoctors] = useState([]); // State to store doctors
  const [date, setDate] = useState(null); // State to store selected date
  const [time, setTime] = useState(null); // State to store selected time
  const [selectedDoctor, setSelectedDoctor] = useState(""); // State to store selected doctor
  const [reason, setReason] = useState(""); // State to store reason for visit
  const { user } = useSelector((state) => state.user); // Get user information from the Redux store
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store

  useEffect(() => {
    getAppointments(setAppointments); // Fetch appointments on component mount
    getDoctors(setDoctors); // Fetch doctors on component mount
  }, []);

  // Columns configuration for the Ant Design Table
  const columns = [
    {
      title: "ID", // Column title for ID
      dataIndex: "_id", // Data index for appointment ID
    },
    {
      title: "Doctor", // Column title for Doctor
      dataIndex: "doctorInfo", // Data index for doctor information
      render: (text, record) => (
        <span>
          Dr. {record.doctorInfo.firstName} {record.doctorInfo.lastName} {/* Display doctor's name */}
        </span>
      ),
    },
    {
      title: "Date & Time", // Column title for Date & Time
      dataIndex: "date", // Data index for appointment date
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp; {/* Format and display appointment date */}
          {moment(record.time).format("HH:mm")} {/* Format and display appointment time */}
        </span>
      ),
    },
    {
      title: "Status", // Column title for Status
      dataIndex: "status", // Data index for appointment status
    },
    {
      title: "Reason", // Column title for Reason
      dataIndex: "reason", // Data index for appointment reason
    },
  ];

  // Render the component
  return (
    <Layout>
      <h3 align="center">Appointments</h3> {/* Heading for appointments */}
      <div className="booking-form">
        <h4>Book a New Appointment</h4> {/* Subheading for booking form */}
        <div className="d-flex flex-column">
          <Select
            className="form-select"
            showSearch
            placeholder="Select Doctor"
            optionFilterProp="label"
            onChange={(value) => setSelectedDoctor(value)}
            value={selectedDoctor}
            options={doctors.map((doctor) => ({
              value: doctor._id,
              label: `Dr. ${doctor.firstName} ${doctor.lastName}`,
            }))}
          />
          <DatePicker
            className="m-2"
            format="DD-MM-YYYY"
            placeholder="Select date"
            onChange={(value) => setDate(value)}
            value={date}
          />
          <TimePicker
            format="HH:mm"
            className="m-2"
            placeholder="Select time"
            onChange={(value) => setTime(value)}
            value={time}
          />
          <Input
            className="m-2"
            placeholder="Reason for visit"
            onChange={(e) => setReason(e.target.value)}
            value={reason}
          />
          <div className="d-flex justify-content-between mt-2">
            <Button type="primary" onClick={() => handleBooking(selectedDoctor, date, time, reason, doctors, user, dispatch, setAppointments)}>
              Book Now {/* Button to book appointment */}
            </Button>
          </div>
        </div>
      </div>
      <Table columns={columns} dataSource={appointments} rowKey={(record) => record._id} /> {/* Ant Design Table to display appointments */}
    </Layout>
  );
};

export default Appointments; // Export the Appointments component as the default export
export { getAppointments, handleBooking, getDoctors }; // Export utility functions
