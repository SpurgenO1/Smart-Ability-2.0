'use strict';

const express = require('express');
const Joi = require('joi');
const authController = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validation.middleware');
const { loginLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(255).required(),
  role: Joi.string().valid('therapist', 'student', 'parent').required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(2).max(255).required(),
  password: Joi.string().required(),
});

const refreshSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', loginLimiter, validateBody(loginSchema), authController.login);
router.post('/refresh', validateBody(refreshSchema), authController.refresh);

module.exports = router;
