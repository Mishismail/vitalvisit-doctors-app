//index.js

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const favicon = require('serve-favicon');
const userRoutes = require('./routes/userRoute.js');
const adminRoutes = require("./routes/adminRoute.js");
const doctorRoutes = require("./routes/doctorRoute.js");
const connectDb = require("./config/db.js");

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDb();

// Create an Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
const corsOptions = {
  origin: [
    'http://localhost:3000', // Allow your local development frontend
    'https://vitalvisit-doctors-app.vercel.app' // Allow your deployed frontend
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials if needed
};

// Middlewares

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// HTTP request logger middleware for node.js
app.use(morgan("dev"));

// Serve favicon from the public directory
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes

// User-related routes
app.use("/api/user", userRoutes);

// Admin-related routes
app.use("/api/admin", adminRoutes);

// Doctor-related routes
app.use("/api/doctor", doctorRoutes);

// Default route for the root
app.get("/", (req, res) => res.send("Express on Vercel"));

// Error handling for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// General error handler
app.use((err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let errorResponse = {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  };

  // Define specific error types
  switch (err.name) {
    case 'ValidationError':
      statusCode = 400;
      errorResponse.message = 'Validation Error';
      errorResponse.details = err.errors;
      break;
    case 'CastError':
      statusCode = 400;
      errorResponse.message = 'Invalid ID format';
      break;
    case 'JsonWebTokenError':
      statusCode = 401;
      errorResponse.message = 'Invalid token';
      break;
    case 'TokenExpiredError':
      statusCode = 401;
      errorResponse.message = 'Token expired';
      break;
    case 'SyntaxError':
      statusCode = 400;
      errorResponse.message = 'Invalid JSON syntax';
      break;
    default:
      if (err.code === 11000) { // MongoDB duplicate key error
        statusCode = 400;
        errorResponse.message = 'Duplicate key error';
        errorResponse.keyValue = err.keyValue;
      }
      break;
  }

  res.status(statusCode).json(errorResponse);
});

// Define the port the server will listen on
const PORT = process.env.PORT || 8080;

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.cyan.bold);
});

// Export the app for serverless deployment
module.exports = app;


