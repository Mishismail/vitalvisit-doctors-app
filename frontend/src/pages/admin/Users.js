//Users.js 

import { Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout";

const Users = () => {
  // State to store the list of users
  const [users, setUsers] = useState([]);

  // Function to fetch users from the API
  const getUsers = async () => {
    try {
      const res = await axios.get("/api/admin/getAllUsers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setUsers(res.data.data); // Update state with fetched users
      }
    } catch (error) {
      console.log(error); // Log any errors
    }
  };

  // Function to handle blocking/unblocking a user
  const handleBlockUser = async (userId, isBlocked) => {
    const endpoint = isBlocked ? "/api/admin/unblockUser" : "/api/admin/blockUser";
    try {
      const res = await axios.post(
        endpoint,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message); // Show success message
        getUsers(); // Refresh users list
      }
    } catch (error) {
      message.error("Something Went Wrong"); // Show error message
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    getUsers();
  }, []);

  // Define columns for the table
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Doctor",
      dataIndex: "isDoctor",
      render: (text, record) => <span>{record.isDoctor ? "Yes" : "No"}</span>,
    },
    {
      title: "Blocked",
      dataIndex: "isBlocked",
      render: (text, record) => <span>{record.isBlocked ? "Yes" : "No"}</span>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <button
            className="m-1 btn btn-danger"
            onClick={() => handleBlockUser(record._id, record.isBlocked)}
          >
            {record.isBlocked ? "Unblock" : "Block"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h3 className="text-center m-2">Users List</h3>
      <Table columns={columns} dataSource={users} rowKey={(record) => record._id} />
    </Layout>
  );
};

export default Users;


