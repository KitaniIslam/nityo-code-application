import request from 'supertest';
import app from '../src/index';
import { AuthService } from '../src/services/auth.service';

describe('Authentication Endpoints', () => {
  const authService = new AuthService();

  describe('POST /api/signup', () => {
    it('should successfully create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        fullname: 'Test User',
        birthday: '1990-01-01',
      };

      const response = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.fullname).toBe(userData.fullname);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        password: 'password123',
        fullname: 'Duplicate User',
        birthday: '1990-01-01',
      };

      // Create first user
      await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/signup')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Email already exists');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: '123', // too short
        fullname: '', // empty
        birthday: '2010-01-01', // under 18
      };

      const response = await request(app)
        .post('/api/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toBeDefined();
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      await authService.signup({
        email: 'login@example.com',
        password: 'password123',
        fullname: 'Login User',
        birthday: '1990-01-01',
      });
    });

    it('should successfully login with valid credentials', async () => {
      const credentials = {
        email: 'login@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/login')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(credentials.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid credentials', async () => {
      const invalidCredentials = {
        email: 'login@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/login')
        .send(invalidCredentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });

    it('should return error for non-existent user', async () => {
      const nonExistentCredentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/login')
        .send(nonExistentCredentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('PUT /api/update-password', () => {
    let userToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create and login a test user
      const result = await authService.signup({
        email: 'password@example.com',
        password: 'password123',
        fullname: 'Password User',
        birthday: '1990-01-01',
      });

      userToken = result.token;
      userId = result.user.id;
    });

    it('should successfully update password with valid current password', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      };

      const response = await request(app)
        .put('/api/update-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Password updated successfully');

      // Verify new password works
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'password@example.com',
          password: 'newpassword123',
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should return error for invalid current password', async () => {
      const passwordData = {
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      };

      const response = await request(app)
        .put('/api/update-password')
        .set('Authorization', `Bearer ${userToken}`)
        .send(passwordData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Current password is incorrect');
    });

    it('should return error without authentication token', async () => {
      const passwordData = {
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      };

      const response = await request(app)
        .put('/api/update-password')
        .send(passwordData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('Token Protection', () => {
    it('should protect protected routes without token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(403);

      expect(response.body.error).toBe('Invalid or expired token');
    });
  });
});
