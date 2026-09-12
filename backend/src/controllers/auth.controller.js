'use strict';

const bcrypt = require('bcryptjs');
const userModel = require('../models/user.model');
const studentModel = require('../models/student.model');
const therapistModel = require('../models/therapist.model');
const parentModel = require('../models/parent.model');
const tokenService = require('../services/token.service');
const auditService = require('../services/audit.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { ApiError } = require('../utils/errors');
const authConfig = require('../config/auth');

const SALT_ROUNDS = 10;
const VALID_ROLES = Object.values(authConfig.roles);

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    throw new ApiError('INVALID_ROLE', `role must be one of: ${VALID_ROLES.join(', ')}`);
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new ApiError('EMAIL_IN_USE', 'An account with this email already exists');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await userModel.create({
    name,
    email,
    password_hash: passwordHash,
    role,
    status: 'active',
  });

  if (role === authConfig.roles.STUDENT) {
    await studentModel.create({ user_id: user.id, display_name: name, profile_status: 'active' });
  } else if (role === authConfig.roles.THERAPIST) {
    await therapistModel.create({ user_id: user.id });
  } else if (role === authConfig.roles.PARENT) {
    await parentModel.create({ user_id: user.id });
  }

  return success(res, { userId: user.id, name: user.name, role: user.role }, 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmailOrName(email);
  if (!user) {
    throw new ApiError('AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new ApiError('AUTH_INVALID_CREDENTIALS', 'Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new ApiError('AUTH_UNAUTHORIZED', 'Account is not active');
  }

  const accessToken = tokenService.signAccessToken(user);
  const refreshToken = tokenService.signRefreshToken(user);

  await auditService.record(user.id, auditService.ACTIONS.LOGIN, user.id);

  return success(res, {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  let payload;
  try {
    payload = tokenService.verifyRefreshToken(refreshToken);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError('AUTH_TOKEN_EXPIRED', 'Refresh token has expired');
    }
    throw new ApiError('AUTH_UNAUTHORIZED', 'Invalid refresh token');
  }

  if (payload.type !== 'refresh') {
    throw new ApiError('AUTH_UNAUTHORIZED', 'Invalid token type');
  }

  const user = await userModel.findById(payload.sub);
  if (!user || user.status !== 'active') {
    throw new ApiError('AUTH_UNAUTHORIZED', 'Account not found or inactive');
  }

  // Rotation: every refresh issues a brand new access+refresh pair.
  const newAccessToken = tokenService.signAccessToken(user);
  const newRefreshToken = tokenService.signRefreshToken(user);

  return success(res, { accessToken: newAccessToken, refreshToken: newRefreshToken });
});

module.exports = { register, login, refresh };
