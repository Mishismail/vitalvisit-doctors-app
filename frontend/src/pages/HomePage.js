import { Row, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DoctorList from "../components/DoctorList";
import Layout from "./../components/Layout";
import { useSelector } from "react-redux";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const { user } = useSelector((state) => state.user);

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
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        message.success(res.data.message);
        getUserData(); // Refresh data after updating status
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <h3 className="text-center">Home Page</h3>
      <br />
      <Row>
        {doctors && doctors.map((doctor) => (
          <DoctorList doctor={doctor} key={doctor._id} handleAccountStatus={handleAccountStatus} />
        ))}
      </Row>
    </Layout>
  );
};

export default HomePage;
