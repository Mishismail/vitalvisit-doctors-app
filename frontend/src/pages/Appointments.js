import React, { useEffect, useState } from "react";
import { Table, DatePicker, TimePicker, message, Input, Button, Select } from "antd";
import axios from "axios";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import Layout from "./../components/Layout";
import logError from "../utils/logError";  // Importing the custom logError function

const getAppointments = async (setAppointments) => {
  try {
    const res = await axios.get("/api/user/user-appointments", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.data.success) {
      setAppointments(res.data.data);
    }
  } catch (error) {
    logError(error);  // Using custom logError function
  }
};

const getDoctors = async (setDoctors) => {
  try {
    const res = await axios.get("/api/user/getAllDoctors", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (res.data.success) {
      setDoctors(res.data.data);
    }
  } catch (error) {
    logError(error);  // Using custom logError function
  }
};

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
      return message.error("Please select doctor, date, time and enter reason for visit");
    }
    dispatch(showLoading());
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
      dispatch(hideLoading());
      if (bookingRes.data.success) {
        message.success("Appointment booked successfully");
        getAppointments(setAppointments);
      } else {
        message.error(bookingRes.data.message);
      }
    } else {
      message.error("Appointment is not available. Please try another slot.");
    }
  } catch (error) {
    dispatch(hideLoading());
    logError("Error during booking:", error);  // Using custom logError function
    message.error("Error during booking. Please try again.");
  }
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [reason, setReason] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getAppointments(setAppointments);
    getDoctors(setDoctors);
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "doctorInfo",
      render: (text, record) => (
        <span>
          Dr. {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
  ];

  return (
    <Layout>
      <h3 align="center">Appointments</h3>
      <div className="booking-form">
        <h4>Book a New Appointment</h4>
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
              Book Now
            </Button>
          </div>
        </div>
      </div>
      <Table columns={columns} dataSource={appointments} rowKey={(record) => record._id} />
    </Layout>
  );
};

export default Appointments;
export { getAppointments, handleBooking, getDoctors };



