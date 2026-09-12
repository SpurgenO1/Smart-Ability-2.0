'use strict';

const express = require('express');
const Joi = require('joi');
const practiceController = require('../controllers/practice.controller');
const { validateBody } = require('../middleware/validation.middleware');

const router = express.Router();

const createSessionSchema = Joi.object({
  studentId: Joi.number().integer().required(),
  phonemeId: Joi.number().integer().required(),
  mode: Joi.string().valid('self_practice', 'guided', 'assessment').default('self_practice'),
});

const featuresSchema = Joi.object().pattern(Joi.string(), Joi.any()).unknown(true);

const createAttemptSchema = Joi.object({
  attemptNumber: Joi.number().integer().min(1).required(),
  targetPhoneme: Joi.string().allow(null, ''),
  recognizedText: Joi.string().allow(null, ''),
  recognitionConfidence: Joi.number().min(0).max(1).allow(null),
  audioFeatures: featuresSchema.default({}),
  mouthFeatures: featuresSchema.default({}),
  audioUrl: Joi.string().allow(null, ''),
  // Accepted for client convenience but never trusted: PASS/FAIL and the
  // consecutive-failure count are always recomputed server-side from
  // stored attempt history. See practice.service.js.
  isSuccess: Joi.boolean().strip(),
  failureCount: Joi.number().integer().strip(),
});

router.post('/sessions', validateBody(createSessionSchema), practiceController.createSession);
router.post(
  '/sessions/:sessionId/attempts',
  validateBody(createAttemptSchema),
  practiceController.createAttempt
);

module.exports = router;
