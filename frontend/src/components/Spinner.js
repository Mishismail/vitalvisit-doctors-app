// Spinner.js

import React from "react";
import Spinners from "react-bootstrap/Spinner"; // Importing the Spinner component from react-bootstrap

// Spinner component to display a loading spinner
const Spinner = () => {
  return (
    <>
      {/* Spinner container with flexbox styling to center the spinner */}
      <div className="d-flex justify-content-center spinner">
        <Spinners animation="border" variant="info" /> {/* Bootstrap spinner with border animation and info variant */}
        <span className="visually-hidden">Loading...</span> {/* Accessible text for screen readers */}
      </div>
    </>
  );
};

export default Spinner; // Exporting the Spinner component as the default export
