
const request = require('supertest');
const express = require('express');
const transactionsRouter = require('../routes/transactions');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const db = require('../db');

// Mock the db module
jest.mock('../db');
// Mock the middleware
jest.mock('../middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = { userId: 1 }; // Default user
    next();
  }),
  isAdmin: jest.fn((req, res, next) => {
    // In a real scenario, you'd check req.user.isAdmin, but for tests we can assume if this middleware is used, the user is an admin
    next();
  }),
}));

const app = express();
app.use(express.json());
app.use('/transactions', transactionsRouter);

describe('Transactions Routes', () => {
  let mockConnection;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock the database transaction logic
    mockConnection = {
      beginTransaction: jest.fn().mockResolvedValue(),
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
      query: jest.fn().mockResolvedValue([[]]), // Default to empty result
      release: jest.fn(),
    };
    db.getConnection.mockResolvedValue(mockConnection);
  });

  describe('POST /transactions', () => {
    it('should create a transaction successfully', async () => {
      const sender = { id: 1, award_balance: 100 };
      mockConnection.query
        .mockResolvedValueOnce([
          [sender]
        ]) // First query for sender balance
        .mockResolvedValueOnce([[]]) // Second for update
        .mockResolvedValueOnce([[]]); // Third for insert

      const res = await request(app)
        .post('/transactions')
        .send({ recipient_id: 2, value_id: 1, amount: 50, message: 'Great job!' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'Kudo submitted successfully! It is now pending approval.');
      expect(mockConnection.commit).toHaveBeenCalled();
    });

    it('should return 400 for insufficient balance', async () => {
        const sender = { id: 1, award_balance: 20 };
        mockConnection.query.mockResolvedValueOnce([[sender]]);

        const res = await request(app)
            .post('/transactions')
            .send({ recipient_id: 2, value_id: 1, amount: 50, message: 'Great job!' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Insufficient award balance.');
        expect(mockConnection.rollback).toHaveBeenCalled();
    });

     it('should return 400 if sending kudos to oneself', async () => {
        const res = await request(app)
            .post('/transactions')
            .send({ recipient_id: 1, value_id: 1, amount: 50, message: 'Great job!' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'You cannot give Kudos to yourself.');
    });

    it('should return 500 on database error', async () => {
        db.getConnection.mockRejectedValue(new Error('DB Error'));
        const res = await request(app)
            .post('/transactions')
            .send({ recipient_id: 2, value_id: 1, amount: 50, message: 'Great job!' });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Internal server error');
    });
  });

  describe('GET /transactions', () => {
    it('should return a feed of approved transactions', async () => {
        const mockFeed = [{ id: 1, amount: 100, message: 'Test' }];
        db.query.mockResolvedValue([mockFeed]);

        const res = await request(app).get('/transactions');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockFeed);
    });

     it('should return 500 on database error', async () => {
        db.query.mockRejectedValue(new Error('DB Error'));
        const res = await request(app).get('/transactions');
        expect(res.statusCode).toEqual(500);
    });
  });

  describe('PATCH /transactions/:id/approve', () => {
    it('should approve a pending transaction', async () => {
        const transaction = { id: 1, recipient_id: 2, amount: 50 };
        mockConnection.query.mockResolvedValueOnce([[transaction]]); // Find transaction
        
        const res = await request(app).patch('/transactions/1/approve');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Transaction approved successfully.');
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users SET spending_balance'), [50, 2]);
    });

    it('should return 404 if transaction not found', async () => {
        mockConnection.query.mockResolvedValueOnce([[]]); // No transaction found
        const res = await request(app).patch('/transactions/999/approve');
        expect(res.statusCode).toEqual(404);
        expect(mockConnection.rollback).toHaveBeenCalled();
    });
  });

  describe('PATCH /transactions/:id/deny', () => {
    it('should deny a pending transaction and refund the sender', async () => {
        const transaction = { id: 1, sender_id: 1, amount: 50 };
        mockConnection.query.mockResolvedValueOnce([[transaction]]); // Find transaction
        
        const res = await request(app).patch('/transactions/1/deny');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Transaction denied successfully.');
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(mockConnection.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users SET award_balance'), [50, 1]);
    });
  });

  describe('GET /transactions/pending', () => {
    it('should return a list of pending transactions for admins', async () => {
        const mockPending = [{ id: 2, status: 'pending' }];
        db.query.mockResolvedValue([mockPending]);
        
        const res = await request(app).get('/transactions/pending');

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(mockPending);
        expect(isAdmin).toHaveBeenCalled();
    });
  });
});
