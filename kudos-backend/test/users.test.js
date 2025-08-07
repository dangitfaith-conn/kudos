
const request = require('supertest');
const express = require('express');
const usersRouter = require('../routes/users');
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

// Mock the db module
jest.mock('../db');
// Mock the authenticateToken middleware
jest.mock('../middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { userId: 1, email: 'test@example.com', isAdmin: false };
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/users', usersRouter);

describe('Users Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /users/me', () => {
    it('should return the logged in user\'s profile', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        full_name: 'Test User',
        award_balance: 100,
        spending_balance: 50,
        is_admin: false,
      };
      db.query.mockResolvedValue([[mockUser]]);

      const res = await request(app).get('/users/me');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockUser);
      expect(authenticateToken).toHaveBeenCalled();
    });

    it('should return 404 if the user is not found', async () => {
      db.query.mockResolvedValue([[]]);

      const res = await request(app).get('/users/me');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'User not found.');
    });

    it('should return 500 for a server error', async () => {
        db.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/users/me');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });
  });

  describe('GET /users', () => {
    it('should return a list of users, excluding the current user', async () => {
      const mockUsers = [
        { id: 2, full_name: 'Jane Doe' },
        { id: 3, full_name: 'John Smith' },
      ];
      db.query.mockResolvedValue([mockUsers]);

      const res = await request(app).get('/users');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockUsers);
      expect(db.query).toHaveBeenCalledWith(
        'SELECT id, full_name FROM users WHERE id != ? ORDER BY full_name ASC',
        [1]
      );
    });

    it('should return 500 for a server error', async () => {
        db.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/users');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });
  });
});
