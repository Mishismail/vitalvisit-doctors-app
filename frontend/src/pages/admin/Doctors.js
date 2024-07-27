// Doctors.js

import { Table, message } from "antd"; // Import Table and message components from antd
import axios from "axios"; // Import axios for making HTTP requests
import React, { useEffect, useState } from "react"; // Import React and necessary hooks
import Layout from "./../../components/Layout"; // Import Layout component

/**
 * Doctors component
 * This component fetches and displays a list of doctors.
 * It allows the admin to approve or reject doctor accounts.
 **/
const Doctors = () => {
  // State to store the list of doctors
  const [doctors, setDoctors] = useState([]);

  /**
   * Fetches the list of doctors from the server.
   */
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching doctors");
    }
  };

  /**
   * Handles the account status change for a doctor.
   *
   * @param {Object} record - The doctor record.
   * @param {string} status - The new status for the doctor.
   */
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/admin/changeAccountStatus",
        { doctorId: record._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // Refresh list after updating status
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Something went wrong");
    }
  };

  // Fetch the list of doctors when the component mounts
  useEffect(() => {
    getDoctors();
  }, []);

  // Define the columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <button
              className="m-1 btn btn-success"
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button className="m-1 btn btn-danger" onClick={() => handleAccountStatus(record, "rejected")}>
              Reject
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h3 className="text-center m-3">All Doctors</h3>
      <Table columns={columns} dataSource={doctors} rowKey={(record) => record._id} />
    </Layout>
  );
};

export default Doctors; // Export the Doctors component as the default export
