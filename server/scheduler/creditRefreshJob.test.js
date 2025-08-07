const { refreshMonthlyCredits } = require('./creditRefreshJob');
const db = require('../db');

// Mock the database module so we don't hit a real DB
jest.mock('../db', () => ({
  execute: jest.fn(),
}));

// Mock console methods to prevent logging during tests and to assert on them
global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

describe('refreshMonthlyCredits', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    db.execute.mockClear();
    console.log.mockClear();
    console.error.mockClear();
  });

  it('should execute the correct SQL query and log a success message', async () => {
    // Arrange: Mock a successful DB response
    const mockResult = [{ affectedRows: 150 }];
    db.execute.mockResolvedValue(mockResult);

    // Act
    await refreshMonthlyCredits();

    // Assert
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith('UPDATE users SET award_balance = award_balance + 100');
    expect(console.log).toHaveBeenCalledWith('Running monthly credit refresh job...');
    expect(console.log).toHaveBeenCalledWith(`Monthly credit refresh complete. ${mockResult[0].affectedRows} users updated.`);
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should log an error if the database query fails', async () => {
    // Arrange: Mock a failed DB response
    const mockError = new Error('DB connection failed');
    db.execute.mockRejectedValue(mockError);

    // Act
    await refreshMonthlyCredits();

    // Assert
    expect(console.error).toHaveBeenCalledWith('Error running monthly credit refresh job:', mockError);
  });
});