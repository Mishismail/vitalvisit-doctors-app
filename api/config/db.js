require('dotenv').config();
const mongoose = require("mongoose");
const colors = require("colors");

/**
 * Function to connect to MongoDB database
 */
const connectDb = async () => {
  try {
    // Check if the DB_URL environment variable is set
    const dbUrl = process.env.DB_URL || 'mongodb+srv://mishdevstack:LIxruoBuhs56qzDY@doctors-app.zhjioxf.mongodb.net/?retryWrites=true&w=majority&appName=doctors-app';
    
    // Connect to the MongoDB database
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log the successful connection to the database
    console.log(`MongoDB Connected: ${mongoose.connection.host}`.bgCyan.white);
  } catch (error) {
    // Log any errors that occur during the connection attempt
    console.error(`Error connecting to database: ${error.message}`.bgRed);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDb;
