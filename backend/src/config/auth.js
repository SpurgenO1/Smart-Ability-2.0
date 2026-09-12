'use strict';

module.exports = {
  accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

  roles: {
    THERAPIST: 'therapist',
    STUDENT: 'student',
    PARENT: 'parent',
  },

  rateLimit: {
    loginMax: Number(process.env.RATE_LIMIT_LOGIN_MAX) || 5,
    loginWindowMs: Number(process.env.RATE_LIMIT_LOGIN_WINDOW_MS) || 60000,
    apiMax: Number(process.env.RATE_LIMIT_API_MAX) || 100,
    apiWindowMs: Number(process.env.RATE_LIMIT_API_WINDOW_MS) || 60000,
  },

  // Engineering thresholds only - not clinical claims.
  business: {
    consecutiveFailureThreshold: Number(process.env.CONSECUTIVE_FAILURE_THRESHOLD) || 5,
    masteryMinAccuracy: Number(process.env.MASTERY_MIN_ACCURACY) || 0.85,
    masteryMinAttempts: Number(process.env.MASTERY_MIN_ATTEMPTS) || 10,
  },
};
