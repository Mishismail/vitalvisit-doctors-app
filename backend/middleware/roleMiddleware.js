const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const roleMiddleware = (roles) => async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !roles.includes(user.role)) {
      return res.status(403).send({
        success: false,
        message: "Access Denied",
      });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Auth Failed",
    });
  }
};

module.exports = roleMiddleware;
