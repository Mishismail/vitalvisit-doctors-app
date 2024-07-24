// src/utils/logError.js
const logError = (error) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(error);
    }
  };
  
  export default logError;
  