import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorList = ({ doctor, handleAccountStatus }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  return (
    <div className="card m-2" style={{ cursor: "pointer" }}>
      <div className="card-header" style={{ textAlign: "center", fontWeight: "bold" }}>
        Dr. {doctor.firstName} {doctor.lastName}
      </div>
      <div className="card-body">
        <p><b>Specialization:</b> {doctor.specialization}</p>
        <p><b>Experience:</b> {doctor.experience}</p>
        <p><b>Fees Per Consultation:</b> {doctor.feesPerConsultation}</p>
        <p><b>Timings:</b> {doctor.starttime} - {doctor.endtime}</p>
        {user.role === "admin" && (
          <div className="admin-actions">
            {doctor.status === "pending" ? (
              <>
                <button className="m-1 btn btn-success" onClick={() => handleAccountStatus(doctor, "approved")}>
                  Approve
                </button>
                <button className="m-1 btn btn-danger" onClick={() => handleAccountStatus(doctor, "rejected")}>
                  Reject
                </button>
              </>
            ) : (
              <button className="m-1 btn btn-danger" onClick={() => handleAccountStatus(doctor, "blocked")}>
                Block
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorList;