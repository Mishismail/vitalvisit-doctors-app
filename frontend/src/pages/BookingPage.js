//BookingPage.js

import { DatePicker, TimePicker, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import "./../styles/LayoutStyles.css";

// BookingPage component to handle booking appointments
const BookingPage = () => {
  const { user } = useSelector((state) => state.user); // Get user information from the Redux store
  const params = useParams(); // Get URL parameters
  const [doctors, setDoctors] = useState([]); // State to store doctor's information
  const [date, setDate] = useState(""); // State to store selected date
  const [time, setTime] = useState(""); // State to store selected time
  const [isAvailable, setIsAvailable] = useState(); // State to store availability status
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store

  // Function to fetch doctor's data
  const getUserData = async () => {
    try {
      const res = await axios.post(
        "/api/doctor/getDoctorById",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data); // Set doctor's data in state
      }
    } catch (error) {
      console.log(error); // Log error
    }
  };

  // Function to check availability of the doctor
  const handleAvailability = async () => {
    try {
      dispatch(showLoading()); // Show loading indicator
      const res = await axios.post(
        "/api/user/booking-availability",
        {
          doctorId: params.doctorId,
          date,
          time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator
      if (res.data.success) {
        setIsAvailable(true); // Set availability status
        message.success(res.data.message); // Show success message
      } else {
        message.error(res.data.message); // Show error message
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator
      console.log(error); // Log error
    }
  };

  // Function to handle booking of the appointment
  const handleBooking = async () => {
    try {
      setIsAvailable(true); // Set availability status
      if (!date && !time) {
        return alert("Date & Time Required"); // Show alert if date and time are not selected
      }
      dispatch(showLoading()); // Show loading indicator
      const res = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctors,
          userInfo: user,
          date: date,
          time: time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator
      if (res.data.success) {
        message.success(res.data.message); // Show success message
      } else {
        message.error(res.data.message); // Show error message
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator
      console.log(error); // Log error
    }
  };

  // useEffect hook to fetch doctor's data on component mount
  useEffect(() => {
    getUserData();
    //eslint-disable-next-line
  }, []);

  // Render the component
  return (
    <Layout>
      <div className="container">
        <h3 className="text-center my-4">Book an Appointment</h3> {/* Heading for booking page */}
        {doctors && (
          <div className="card mx-auto mb-4" style={{ maxWidth: "350px" }}>
            <div className="card-body">
              <h5 className="card-title text-center">
                Dr. {doctors.firstName} {doctors.lastName}
              </h5>
              <h6 className="card-subtitle mb-2 text-muted text-center">
                Fees: {doctors.feesPerConsultation}
              </h6>
              <h6 className="card-subtitle mb-2 text-muted text-center">
                Timings: {doctors.starttime} - {doctors.endtime}
              </h6>
              <div className="appoint-card-body">
                <div className="d-flex flex-column w-50 mx-auto">
                  <DatePicker
                    className="m-2 date-picker"
                    format="DD-MM-YYYY"
                    onChange={(value) => {
                      const selectedDate = value ? value.format("DD-MM-YYYY") : "";
                      setDate(selectedDate);
                    }}
                  />
                  <TimePicker
                    format="HH:mm"
                    className="m-2 time-picker"
                    onChange={(time) => setTime(time && time.format("HH:mm"))}
                  />
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary mt-2 w-100"
                      onClick={handleAvailability}
                    >
                      Check Availability
                    </button>
                  </div>
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-dark mt-2 w-100"
                      onClick={handleBooking}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage; // Export the BookingPage component as the default export
