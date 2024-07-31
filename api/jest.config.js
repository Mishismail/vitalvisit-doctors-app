module.exports = {
  testEnvironment: 'node', // Specifies that we are testing a Node.js environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Points to any setup files needed after Jest environment is set up
  testTimeout: 20000, // Increases the default timeout for tests
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'], // Specifies file extensions Jest will use
};
