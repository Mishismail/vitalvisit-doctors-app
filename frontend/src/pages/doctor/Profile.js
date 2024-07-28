//Profile.js

import { Col, Form, Input, Row, TimePicker, message } from "antd";
import axios from "axios";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Removed useParams import
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import Layout from "./../../components/Layout";

const Profile = () => {
  const { user } = useSelector((state) => state.user); // Get the user from Redux state
  const [doctor, setDoctor] = useState(null); // Local state to store doctor details
  const dispatch = useDispatch(); // Hook to dispatch actions
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading()); // Show loading indicator
      const starttime = values.starttime.format("HH:mm");
      const endtime = values.endtime.format("HH:mm");
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading()); // Hide loading indicator
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/"); // Navigate to home page
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator
      console.log(error);
      message.error("Something Went Wrong ");
    }
  };

  // Function to get doctor information
  const getDoctorInfo = async () => {
    try {
      const res = await axios.post(
        "/api/doctor/getDoctorInfo",
        { userId: user._id }, // Ensure it uses user._id
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data); // Set doctor information to local state
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDoctorInfo(); // Fetch doctor information on component mount
    //eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h3 align="center">Manage Profile</h3>
      {doctor && (
        <Form
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...doctor,
            starttime: moment(doctor.starttime, "HH:mm"),
            endtime: moment(doctor.endtime, "HH:mm")
          }}
        >
          <h4 className="">Personal Details : </h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="First Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Last Name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Phone Number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Email"
                name="email"
                required
                rules={[{ required: true }]}
              >
                <Input type="email" placeholder="Email" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item label="Website" name="website">
                <Input type="text" placeholder="Website" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Address"
                name="address"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Clinic Address" />
              </Form.Item>
            </Col>
          </Row>
          <h4>Professional Details :</h4>
          <Row gutter={20}>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Experience"
                name="experience"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Experience" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                label="Fees Per Consultation"
                name="feesPerConsultation"
                required
                rules={[{ required: true }]}
              >
                <Input type="text" placeholder="Fee" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name="starttime"
                label="Start Time"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}>
              <Form.Item
                name="endtime"
                label="End Time"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={8}></Col>
            <Col xs={24} md={24} lg={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;
