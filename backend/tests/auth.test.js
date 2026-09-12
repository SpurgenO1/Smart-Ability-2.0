'use strict';

const { resetDatabase } = require('./setup');
const { request, app } = require('./helpers');

describe('auth', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('register + login returns tokens and user summary', async () => {
    const registerRes = await request(app).post('/api/v1/auth/register').send({
      name: 'Asha Verma',
      email: 'asha@example.com',
      password: 'Password123!',
      role: 'therapist',
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data.role).toBe('therapist');

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'asha@example.com', password: 'Password123!' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.accessToken).toEqual(expect.any(String));
    expect(loginRes.body.data.refreshToken).toEqual(expect.any(String));
    expect(loginRes.body.data.user.email).toBe('asha@example.com');
  });

  test('login with wrong password returns AUTH_INVALID_CREDENTIALS', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      password: 'Password123!',
      role: 'student',
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ravi@example.com', password: 'WrongPassword!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('AUTH_INVALID_CREDENTIALS');
  });

  test('duplicate email registration is rejected', async () => {
    const payload = { name: 'Dup User', email: 'dup@example.com', password: 'Password123!', role: 'parent' };
    await request(app).post('/api/v1/auth/register').send(payload);
    const res = await request(app).post('/api/v1/auth/register').send(payload);

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('EMAIL_IN_USE');
  });

  test('protected route without a token returns AUTH_UNAUTHORIZED', async () => {
    const res = await request(app).get('/api/v1/phonemes');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_UNAUTHORIZED');
  });
});
