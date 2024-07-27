const mongoose = require("mongoose");
const colors = require("colors");

/**
 * Function to connect to MongoDB database
 */
const connectDb = async () => {
  try {
    // Check if the DB_URL environment variable is set
    if (!process.env.DB_URL) {
      throw new Error("DB_URL environment variable not set");
    }

    // Connect to the MongoDB database
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log the successful connection to the database
    console.log(`MongoDB Connected: ${mongoose.connection.host}`.bgCyan.white);
  } catch (error) {
    // Log any errors that occur during the connection attempt
    console.error(`Error connecting to database: ${error}`.bgRed);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDb;