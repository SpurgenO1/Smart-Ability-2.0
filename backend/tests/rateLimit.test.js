'use strict';

const { resetDatabase } = require('./setup');
const { request, app } = require('./helpers');

describe('login rate limiting (5 failed attempts / minute / IP)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('the 6th failed login attempt in a window is rate-limited', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Rate Limited',
      email: 'ratelimited@example.com',
      password: 'Password123!',
      role: 'student',
    });

    const attempts = [];
    for (let i = 0; i < 5; i += 1) {
      attempts.push(
        await request(app)
          .post('/api/v1/auth/login')
          .send({ email: 'ratelimited@example.com', password: 'WrongPassword!' })
      );
    }
    attempts.forEach((res) => expect(res.status).toBe(401));

    const sixth = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'ratelimited@example.com', password: 'WrongPassword!' });

    expect(sixth.status).toBe(429);
    expect(sixth.body.error.code).toBe('RATE_LIMITED');
  });

  test('a successful login does not count against the failed-attempt limit', async () => {
    await request(app).post('/api/v1/auth/register').send({
      name: 'Good Login',
      email: 'goodlogin@example.com',
      password: 'Password123!',
      role: 'student',
    });

    for (let i = 0; i < 5; i += 1) {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'goodlogin@example.com', password: 'Password123!' });
      expect(res.status).toBe(200);
    }

    const sixth = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'goodlogin@example.com', password: 'Password123!' });
    expect(sixth.status).toBe(200);
  });
});
