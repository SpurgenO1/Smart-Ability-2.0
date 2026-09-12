'use strict';

const express = require('express');
const Joi = require('joi');
const audioController = require('../controllers/audio.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validation.middleware');

const router = express.Router();

const uploadUrlSchema = Joi.object({
  format: Joi.string().allow(null, ''),
  fileType: Joi.string().allow(null, ''),
  fileName: Joi.string().allow(null, ''),
  durationMs: Joi.number().integer().min(0).allow(null),
  sampleRate: Joi.number().integer().min(0).allow(null),
  channels: Joi.number().integer().min(1).allow(null),
});

const completeSchema = Joi.object({
  fileId: Joi.string(),
  audioId: Joi.string(),
  uploadPath: Joi.string().allow(null, ''),
  sessionId: Joi.number().integer().allow(null),
  attemptId: Joi.number().integer().allow(null),
}).or('fileId', 'audioId');

router.post('/upload-url', authenticate, validateBody(uploadUrlSchema), audioController.requestUploadUrl);
router.post('/complete', authenticate, validateBody(completeSchema), audioController.completeUpload);

// Local storage provider's raw byte sink for the signed upload URL returned
// above. Auth here is the HMAC signature itself, not a Bearer token - same
// trust model as a presigned S3/GCS PUT URL.
router.put('/raw/:fileId', express.raw({ type: '*/*', limit: '25mb' }), audioController.uploadRaw);

module.exports = router;
