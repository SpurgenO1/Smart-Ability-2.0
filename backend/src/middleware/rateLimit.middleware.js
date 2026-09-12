'use strict';

const rateLimit = require('express-rate-limit');
const authConfig = require('../config/auth');

const loginStore = new rateLimit.MemoryStore();
const apiStore = new rateLimit.MemoryStore();

const loginLimiter = rateLimit({
  windowMs: authConfig.rateLimit.loginWindowMs,
  max: authConfig.rateLimit.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  store: loginStore,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many login attempts, please try again later' },
    });
  },
});

const apiLimiter = rateLimit({
  windowMs: authConfig.rateLimit.apiWindowMs,
  max: authConfig.rateLimit.apiMax,
  standardHeaders: true,
  legacyHeaders: false,
  store: apiStore,
  keyGenerator: (req) => (req.user ? `user:${req.user.id}` : req.ip),
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many requests, please slow down' },
    });
  },
});

// Test-only hook: express-rate-limit's MemoryStore persists across test
// cases in the same process, which would otherwise leak a "too many login
// attempts" state from one test into the next.
function resetRateLimitStores() {
  loginStore.resetAll();
  apiStore.resetAll();
}

module.exports = { loginLimiter, apiLimiter, resetRateLimitStores };
