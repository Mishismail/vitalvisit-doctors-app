// authMiddleware.js

const jwt = require("jsonwebtoken");

/**
 * Middleware to authenticate JWT tokens
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers["authorization"].split(" ")[1];
    console.log("Token:", token);

    // Check if the token is provided
    if (!token) {
      return res.status(401).send({
        message: "No token provided",
        success: false,
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);

    // Attach user ID and role to the request body
    req.body.userId = decoded.id;
    req.body.role = decoded.role;

    // Proceed to the next middleware/controller
    next();
  } catch (error) {
    console.log(error);
    // Send error response if authentication fails
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};

module.exports = authMiddleware;