//Homepage.js

import { Row, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DoctorList from "../components/DoctorList";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";

// HomePage component to display list of doctors
const HomePage = () => {
  const [doctors, setDoctors] = useState([]); // State to store list of doctors
  const { user } = useSelector((state) => state.user); // Get user information from the Redux store

  // Function to fetch list of doctors
  const getUserData = async () => {
    try {
      const res = await axios.get(
        "/api/user/getAllDoctors",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data); // Set doctors state with fetched data
      }
    } catch (error) {
      console.log(error); // Log error
    }
  };

  // Function to handle account status change
  const handleAccountStatus = async (doctor, status) => {
    try {
      const res = await axios.post(
        "/api/admin/changeAccountStatus",
        { doctorId: doctor._id, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message); // Show success message
        getUserData(); // Refresh data after updating status
      } else {
        message.error(res.data.message); // Show error message
      }
    } catch (error) {
      console.log(error); // Log error
      message.error("Something Went Wrong"); // Show error message
    }
  };

  // useEffect hook to fetch list of doctors on component mount
  useEffect(() => {
    getUserData();
  }, []);

  // Render the component
  return (
    <Layout>
      <h3 className="text-center">Home Page</h3> {/* Heading for home page */}
      <br />
      <p>Welcome, {user.name}</p> {/* Example usage of the user variable */}
      <Row>
        {doctors && doctors.map((doctor) => (
          <DoctorList doctor={doctor} key={doctor._id} handleAccountStatus={handleAccountStatus} />
        ))}
      </Row>
    </Layout>
  );
};

export default HomePage; // Export the HomePage component as the default export


