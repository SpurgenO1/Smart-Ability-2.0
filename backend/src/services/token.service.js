'use strict';

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, type: 'access' },
    authConfig.accessSecret,
    { expiresIn: authConfig.accessExpiresIn }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, type: 'refresh' },
    authConfig.refreshSecret,
    { expiresIn: authConfig.refreshExpiresIn }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, authConfig.accessSecret);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, authConfig.refreshSecret);
}

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken };
