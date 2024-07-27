// src/utils/logError.js

// Function to log errors to the console, except during tests
const logError = (error) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(error); // Log the error if not in test environment
  }
};

export default logError; // Export the logError function as the default export
  