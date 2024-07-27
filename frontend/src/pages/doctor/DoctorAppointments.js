//DoctorAppointments.js

import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";
import moment from "moment";

// DoctorAppointments component to display and manage doctor's appointments
const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]); // State to store appointments

  // Function to fetch appointments from the server
  const getAppointments = async () => {
    try {
      const res = await axios.get("/api/doctor/doctor-appointments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization header with token
        },
      });
      if (res.data.success) {
        setAppointments(res.data.data); // Update appointments state with fetched data
      }
    } catch (error) {
      console.log(error); // Log any errors
    }
  };

  // useEffect hook to fetch appointments on component mount
  useEffect(() => {
    getAppointments();
  }, []);

  // Function to handle appointment status updates
  const handleStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/doctor/update-status",
        { appointmentsId: record._id, status }, // Payload with appointment ID and new status
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization header with token
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message); // Show success message
        getAppointments(); // Refresh appointments list
      }
    } catch (error) {
      console.log(error); // Log any errors
      message.error("Something Went Wrong"); // Show error message
    }
  };

  // Columns configuration for the Ant Design Table
  const columns = [
    {
      title: "ID", // Column title for ID
      dataIndex: "_id", // Data index for appointment ID
    },
    {
      title: "Patient", // Column title for Patient
      dataIndex: "userInfo", // Data index for patient information
      render: (text, record) => (
        <span>
          {record.userInfo.name} {/* Display patient's name */}
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
    {
      title: "Actions", // Column title for Actions
      dataIndex: "actions", // Data index for actions
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" && (
            <div className="d-flex">
              <button
                className="m-1 btn btn-success"
                onClick={() => handleStatus(record, "approved")} // Approve button
              >
                Approve
              </button>
              <button
                className="m-1 btn btn-danger ms-2"
                onClick={() => handleStatus(record, "reject")} // Reject button
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  // Render the component
  return (
    <Layout>
      <h3>Appointments Lists</h3> {/* Heading for the appointments list */}
      <Table columns={columns} dataSource={appointments} rowKey={(record) => record._id} /> {/* Ant Design Table to display appointments */}
    </Layout>
  );
};

export default DoctorAppointments; // Export the DoctorAppointments component as the default export