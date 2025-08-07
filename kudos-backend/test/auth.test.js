
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRouter = require('../routes/auth');
const db = require('../db');
const config = require('../config');

// Mock the db module
jest.mock('../db');
// Mock the bcrypt module
jest.mock('bcrypt');
// Mock the jsonwebtoken module
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/login', () => {
    it('should return a token for valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        is_admin: false,
      };
      db.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('testtoken');

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token', 'testtoken');
    });

    it('should return 401 for invalid credentials (user not found)', async () => {
      db.query.mockResolvedValue([[]]);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'wrong@example.com', password: 'password' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 401 for invalid credentials (wrong password)', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        is_admin: false,
      };
      db.query.mockResolvedValue([[mockUser]]);
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return 400 if email or password are not provided', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Email and password are required.');
    });

    it('should return 500 for a server error', async () => {
        db.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });
  });
});
