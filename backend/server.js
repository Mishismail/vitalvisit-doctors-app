// server.js

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const userRoutes = require('./routes/userRoute.js');
const adminRoutes = require("./routes/adminRoute.js");
const doctorRoutes = require("./routes/doctorRoute.js");
const connectDb = require("./config/db");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDb();

// Create an Express application
const app = express();

// Middlewares

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// HTTP request logger middleware for node.js
app.use(morgan("dev"));

// Routes

// User-related routes
app.use("/api/user", userRoutes);

// Admin-related routes
app.use("/api/admin", adminRoutes);

// Doctor-related routes
app.use("/api/doctor", doctorRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Error handling for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// General error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// Define the port the server will listen on
const PORT = process.env.PORT || 8080;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.cyan.bold);
});

