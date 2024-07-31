// authController.test.js

const request = require('supertest');
const http = require('http');
const app = require('../server.js');
const userModel = require('../models/userModel.js');
const doctorModel = require('../models/doctorModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Test suite for Auth Controller
describe('Auth Controller Tests', () => {
  let token; // Variable to store JWT token

  // Run this before all tests
  beforeAll(async () => {
    jest.setTimeout(20000); // Increase timeout to 20 seconds for async operations

    // Ensure an existing user is in the database
    const existingUser = await userModel.findOne({ email: 'drbeverleyadams@gmail.com' });
    if (!existingUser) {
      // Hash the password
      const hashedPassword = await bcrypt.hash('SocksAndFeet123#', 10);

      // Create a new user with the role of 'doctor'
      const newUser = new userModel({
        _id: '66a0e8e42c8a0645135c4665',
        name: 'Dr Beverly Adams',
        email: 'drbeverleyadams@gmail.com',
        password: hashedPassword,
        role: 'doctor',
      });

      // Save the new user to the database
      await newUser.save();
    }

    // Create a JWT token for the existing user
    token = jwt.sign({ id: '66a0e8e42c8a0645135c4665', role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  });

  // Test suite for the Login Controller
  describe('Login Controller', () => {
    // Test case for logging in an existing user
    it('should login an existing user', async () => {
      const loginData = {
        email: 'drbeverleyadams@gmail.com',
        password: 'SocksAndFeet123#',
      };

      // Send POST request to the login endpoint
      const response = await request(server)
        .post('/api/user/login')
        .send(loginData)
        .expect(200)
        .expect('Content-Type', /json/);

      // Verify the response
      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body.message).toBe('Login Success');
      expect(body).toHaveProperty('token'); // Ensure the token is present in the response
    });
  });

  // Test suite for the Register Controller
  describe('Register Controller', () => {
    // Test case for registering a new user
    it('should register a new user', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
        role: 'user'
      };

      // Send POST request to the register endpoint
      const response = await request(server)
        .post('/api/user/register')
        .send(registerData)
        .expect(201)
        .expect('Content-Type', /json/);

      // Verify the response
      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty('token'); // Ensure the token is present in the response
    });

    // Test case for registering a new doctor
    it('should register a new doctor', async () => {
      const registerData = {
        name: 'Dr John Smith',
        email: 'dr.johnsmith@example.com',
        password: 'StrongPassword123!',
        role: 'doctor',
        phone: '1234567890',
        website: 'www.drjohnsmith.com',
        address: '123 Main St',
        specialization: 'Cardiology',
        experience: '10 years',
        feesPerConsultation: 200,
        starttime: '09:00',
        endtime: '17:00'
      };

      // Send POST request to the register endpoint
      const response = await request(server)
        .post('/api/user/register')
        .send(registerData)
        .expect(201)
        .expect('Content-Type', /json/);

      // Verify the response
      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty('token'); // Ensure the token is present in the response
    });

    // Test case for registering a new admin
    it('should register a new admin', async () => {
      const registerData = {
        name: 'Admin User',
        email: 'admin.user@example.com',
        password: 'StrongPassword123!',
        role: 'admin'
      };

      // Send POST request to the register endpoint
      const response = await request(server)
        .post('/api/user/register')
        .send(registerData)
        .expect(201)
        .expect('Content-Type', /json/);

      // Verify the response
      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty('token'); // Ensure the token is present in the response
    });
  });
});