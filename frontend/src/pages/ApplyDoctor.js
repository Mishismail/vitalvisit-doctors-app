//ApplyDoctor.js

import { Col, Form, Input, Row, TimePicker, message } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import Layout from "./../components/Layout";

// ApplyDoctor component to handle doctor application
const ApplyDoctor = () => {
  const { user } = useSelector((state) => state.user); // Get user information from the Redux store
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle form submission
  const handleFinish = async (values) => {
    try {
      dispatch(showLoading()); // Show loading indicator
      const starttime = values.starttime.format("HH:mm"); // Format start time
      const endtime = values.endtime.format("HH:mm"); // Format end time
      const res = await axios.post(
        "/api/user/apply-doctor",
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
        localStorage.setItem("token", res.data.token); // Store token upon application
        navigate("/"); // Navigate to home page
      } else {
        message.error(res.data.message); // Show error message
      }
    } catch (error) {
      dispatch(hideLoading()); // Hide loading indicator
      console.log(error); // Log error
      message.error("Something Went Wrong"); // Show error message
    }
  };

  // Render the component
  return (
    <Layout>
      <h3 className="text-center"><b>Apply Doctor</b></h3> {/* Heading for apply doctor form */}
      <Form layout="vertical" onFinish={handleFinish} className="m-3">
        <h4 className=""><b>Personal Details :</b></h4> {/* Personal details section */}
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="First Name"
              name="firstName"
              required
              rules={[{ required: true, message: "First name is required" }]}
            >
              <Input type="text" placeholder="First Name" /> {/* Input for first name */}
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Last Name"
              name="lastName"
              required
              rules={[{ required: true, message: "Last name is required" }]}
            >
              <Input type="text" placeholder="Last Name" /> {/* Input for last name */}
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Phone"
              name="phone"
              required
              rules={[{ required: true, message: "Phone number is required" }]}
            >
              <Input type="text" placeholder="Phone Number" /> {/* Input for phone number */}
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Email"
              name="email"
              required
              rules={[{ required: true, message: "Email is required" }]}
            >
              <Input type="email" placeholder="Email" /> {/* Input for email */}
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Password"
              name="password"
              required
              rules={[
                { required: true, message: "Password is required" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password placeholder="Password" /> {/* Input for password */}
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
              rules={[{ required: true, message: "Address is required" }]}
            >
              <Input type="text" placeholder="Clinic Address" /> {/* Input for address */}
            </Form.Item>
          </Col>
        </Row>
        <br />
        <h4><b>Professional Details :</b></h4> {/* Professional details section */}
        <Row gutter={20}>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Specialization"
              name="specialization"
              required
              rules={[{ required: true, message: "Specialization is required" }]}
            >
              <Input type="text" placeholder="Specialization" /> {/* Input for specialization */}
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Experience"
              name="experience"
              required
              rules={[{ required: true, message: "Experience is required" }]}
            >
              <Input type="text" placeholder="Experience" /> {/* Input for experience */}
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={8}>
            <Form.Item
              label="Fees Per Consultation"
              name="feesPerConsultation"
              required
              rules={[{ required: true, message: "Fee is required" }]}
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
            <br />
            <button className="btn btn-primary form-btn" type="submit">
              Submit {/* Submit button */}
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor; // Export the ApplyDoctor component as the default export
