// roleMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 * Middleware to check user role authorization
 * @param {Array} roles - Array of roles that are allowed access
 */
const roleMiddleware = (roles) => async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers["authorization"].split(" ")[1];
    
    // Check if the token is provided
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by decoded ID
    const user = await User.findById(decoded.id);

    // Check if user exists and has the required role
    if (!user || !roles.includes(user.role)) {
      return res.status(403).send({
        success: false,
        message: "Access Denied",
      });
    }

    // Attach user to request object
    req.user = user; 
    next();
  } catch (error) {
    console.log(error);
    // Send error response if authentication fails
    res.status(401).send({
      success: false,
      message: "Auth Failed",
    });
  }
};

module.exports = roleMiddleware;

