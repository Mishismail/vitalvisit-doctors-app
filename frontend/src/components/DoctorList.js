import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const DoctorList = ({ doctor, handleAccountStatus }) => {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const { user } = useSelector((state) => state.user); // Get user information from the Redux store

  // Function to handle card click
  const handleCardClick = () => {
    navigate(`/doctor/profile/${doctor._id}`); // Navigate to doctor's profile page
  };

  return (
    <div className="card m-2" style={{ cursor: "pointer" }} onClick={handleCardClick}>
      {/* Doctor's name in the card header */}
      <div className="card-header" style={{ textAlign: "center", fontWeight: "bold" }}>
        Dr. {doctor.firstName} {doctor.lastName}
      </div>
      <div className="card-body">
        {/* Display doctor's specialization */}
        <p><b>Specialization:</b> {doctor.specialization}</p>
        {/* Display doctor's experience */}
        <p><b>Experience:</b> {doctor.experience}</p>
        {/* Display doctor's fees per consultation */}
        <p><b>Fees Per Consultation:</b> {doctor.feesPerConsultation}</p>
        {/* Display doctor's available timings */}
        <p><b>Timings:</b> {doctor.starttime} - {doctor.endtime}</p>
        
        {/* Admin actions: Approve, Reject, or Block based on doctor's status */}
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
