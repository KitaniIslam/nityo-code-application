import { initializeDatabase, closeDatabase } from '../src/db/sqlite';

beforeAll(() => {
  // Use in-memory database for testing
  process.env.NODE_ENV = 'test';
});

afterAll(() => {
  closeDatabase();
});

beforeEach(() => {
  // Clean up database before each test
  try {
    const db = require('../src/db/sqlite').db;
    db.exec('DELETE FROM users');
  } catch (error) {
    console.warn('Failed to clean up database:', error);
  }
});
