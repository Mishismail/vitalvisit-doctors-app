//Register.js

import { Form, Input, message, Select, Row, Col } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const { Option } = Select;

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState("user");

  const submitHandler = async (values) => {
    try {
      dispatch(showLoading());
      const { data } = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (data.success) {
        message.success("Registration Successful");
        localStorage.setItem("token", data.token); // Store token upon registration
        navigate("/");
      } else {
        message.error(data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="register-page">
      <Form layout="vertical" onFinish={submitHandler}>
        <h1>Register</h1>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please input your name!" },
            { min: 3, message: "Your name must be at least 3 characters" },
            { max: 50, message: "Your name cannot exceed 50 characters" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Invalid email!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 8, message: "Your password must be at least 8 characters" },
            { max: 128, message: "Your password cannot exceed 128 characters" },
            {
              pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role!" }]}
        >
          <Select placeholder="Select a role" onChange={(value) => setRole(value)}>
            <Option value="user">User</Option>
            <Option value="doctor">Doctor</Option>
            <Option value="admin">Admin</Option>
          </Select>
        </Form.Item>

        {role === "doctor" && (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[{ required: true, message: "Please input your phone number!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Website"
                  name="website"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true, message: "Please input your address!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  rules={[{ required: true, message: "Please input your specialization!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  rules={[{ required: true, message: "Please input your experience!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Fees Per Consultation"
                  name="feesPerConsultation"
                  rules={[{ required: true, message: "Please input your fees per consultation!" }]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Start Time"
                  name="starttime"
                  rules={[{ required: true, message: "Please input your start time!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="End Time"
                  name="endtime"
                  rules={[{ required: true, message: "Please input your end time!" }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        <div className="d-flex justify-content-between">
          <Link to="/login">Already Registered? Click Here to Login</Link>
          <button className="btn btn-primary" type="submit">
            Register
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Register;






