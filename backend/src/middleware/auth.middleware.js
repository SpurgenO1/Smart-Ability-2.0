'use strict';

const tokenService = require('../services/token.service');
const userModel = require('../models/user.model');
const studentModel = require('../models/student.model');
const therapistModel = require('../models/therapist.model');
const parentModel = require('../models/parent.model');
const { error } = require('../utils/apiResponse');

async function loadRoleEntity(user) {
  if (user.role === 'student') return studentModel.findByUserId(user.id);
  if (user.role === 'therapist') return therapistModel.findByUserId(user.id);
  if (user.role === 'parent') return parentModel.findByUserId(user.id);
  return null;
}

async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return error(res, 401, 'AUTH_UNAUTHORIZED', 'Missing or malformed Authorization header');
  }

  let payload;
  try {
    payload = tokenService.verifyAccessToken(token);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 401, 'AUTH_TOKEN_EXPIRED', 'Access token has expired');
    }
    return error(res, 401, 'AUTH_UNAUTHORIZED', 'Invalid access token');
  }

  if (payload.type !== 'access') {
    return error(res, 401, 'AUTH_UNAUTHORIZED', 'Invalid token type');
  }

  const user = await userModel.findById(payload.sub);
  if (!user || user.status !== 'active') {
    return error(res, 401, 'AUTH_UNAUTHORIZED', 'Account not found or inactive');
  }

  const roleEntity = await loadRoleEntity(user);

  req.user = user;
  req.roleEntity = roleEntity;
  next();
}

module.exports = { authenticate };
