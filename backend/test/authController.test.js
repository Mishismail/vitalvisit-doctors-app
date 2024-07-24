const request = require('supertest');
const http = require('http');
const app = require('../server.js');
const userModel = require('../models/userModel.js');
const doctorModel = require('../models/doctorModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const server = http.createServer(app);

describe('Auth Controller Tests', () => {
  let token;

  beforeAll(async () => {
    jest.setTimeout(20000); // Increase timeout to 20 seconds

    // Ensure existing user is in the database
    const existingUser = await userModel.findOne({ email: 'drbeverleyadams@gmail.com' });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('SocksAndFeet123#', 10); // Hash the password

      const newUser = new userModel({
        _id: '66a0e8e42c8a0645135c4665',
        name: 'Dr Beverly Adams',
        email: 'drbeverleyadams@gmail.com',
        password: hashedPassword,
        role: 'doctor',
      });

      await newUser.save();
    }

    // Create a JWT token for the existing user
    token = jwt.sign({ id: '66a0e8e42c8a0645135c4665', role: 'doctor' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  });

  describe('Login Controller', () => {
    it('should login an existing user', async () => {
      const loginData = {
        email: 'drbeverleyadams@gmail.com',
        password: 'SocksAndFeet123#',
      };

      const response = await request(server)
        .post('/api/user/login')
        .send(loginData)
        .expect(200)
        .expect('Content-Type', /json/);

      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body.message).toBe('Login Success');
      expect(body).toHaveProperty('token');
    });
  });

  describe('Register Controller', () => {
    it('should register a new user', async () => {
      const registerData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
        role: 'user'
      };

      const response = await request(server)
        .post('/api/user/register')
        .send(registerData)
        .expect(201)
        .expect('Content-Type', /json/);

      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty('token');
    });

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

      const response = await request(server)
        .post('/api/user/register')
        .send(registerData)
        .expect(201)
        .expect('Content-Type', /json/);

      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty('token');
    });

    it('should register a new admin', async () => {
      const registerData = {
        name: 'Admin User',
        email: 'admin.user@example.com',
        password: 'StrongPassword123!',
        role: 'admin'
      };

      const response = await request(server)
        .post('/api/user/register')
        .send(registerData)
        .expect(201)
        .expect('Content-Type', /json/);

      const body = response.body;
      expect(body).toBeDefined();
      expect(body.success).toBe(true);
      expect(body).toHaveProperty('token');
    });
  });
});
















