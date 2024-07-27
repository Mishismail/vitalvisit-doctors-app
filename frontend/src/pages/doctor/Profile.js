//Profile.js

import { Col, Form, Input, Row, TimePicker, message } from "antd";
import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import Layout from "./../../components/Layout";

// Profile component to manage doctor's profile information
const Profile = () => {
  const { user } = useSelector((state) => state.user); // Get user information from the Redux store
  const [doctor, setDoctor] = useState(null); // State to store doctor's information
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
  const navigate = useNavigate(); // Hook to navigate programmatically
  const params = useParams(); // Hook to get URL parameters

  // Function to handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading()); // Show loading indicator
      const starttime = values.starttime.format("HH:mm"); // Format start time
      const endtime = values.endtime.format("HH:mm"); // Format end time
      const res = await axios.post(
        "/api/doctor/updateProfile",
        {
          ...values,
          userId: user._id,
          starttime,
          endtime,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization header with token
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator
      if (res.data.success) {
        message.success(res.data.message); // Show success message
        navigate("/"); // Navigate to home page
      } else {
        message.error(res.data.message); // Show error message
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator
      console.log(error); // Log error
      message.error("Something Went Wrong "); // Show error message
    }
  };

  // Function to fetch doctor's information
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/doctor/getDoctorInfo",
        { userId: params.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Authorization header with token
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data); // Set doctor's information in state
      }
    } catch (error) {
      console.log(error); // Log error
    }
  };

  // useEffect hook to fetch doctor's information on component mount
  useEffect(() => {
    getDoctorInfo();
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h3 align="center">Manage Profile</h3> {/* Heading for managing profile */}
      {doctor && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...doctor,
            starttime: moment(doctor.starttime, "HH:mm"), // Initialize start time
            endtime: moment(doctor.endtime, "HH:mm") // Initialize end time
          }}
        >
          <h4 className="">Personal Details :</h4> {/* Personal details section */}
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="First Name" /> {/* Input for first name */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Last Name" /> {/* Input for last name */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Phone Number" /> {/* Input for phone number */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="Email" /> {/* Input for email */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Website" name="website">
                <Input type="text" placeholder="Website" /> {/* Input for website */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Clinic Address" /> {/* Input for address */}
              </Form.Item>
            </Col>
          </Row>
          <h4>Professional Details :</h4> {/* Professional details section */}
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Specialization" /> {/* Input for specialization */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Experience" /> {/* Input for experience */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Consultation"
                name="feesPerConsultation"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Fee" /> {/* Input for fees per consultation */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name="starttime"
                label="Start Time"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" /> {/* Time picker for start time */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name="endtime"
                label="End Time"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" /> {/* Time picker for end time */}
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update {/* Update button */}
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile; // Export the Profile component as the default export
