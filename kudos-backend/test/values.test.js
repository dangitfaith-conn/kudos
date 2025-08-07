
const request = require('supertest');
const express = require('express');
const valuesRouter = require('../routes/values');
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
app.use('/values', valuesRouter);

describe('Values Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /values', () => {
    it('should return a list of company values', async () => {
      const mockValues = [
        { id: 1, name: 'Integrity' },
        { id: 2, name: 'Teamwork' },
      ];
      db.query.mockResolvedValue([mockValues]);

      const res = await request(app).get('/values');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockValues);
      expect(authenticateToken).toHaveBeenCalled();
    });

    it('should return 500 for a server error', async () => {
        db.query.mockRejectedValue(new Error('Database error'));

        const res = await request(app).get('/values');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });
  });
});
