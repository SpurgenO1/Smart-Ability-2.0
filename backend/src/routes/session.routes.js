'use strict';

const express = require('express');
const Joi = require('joi');
const sessionController = require('../controllers/session.controller');
const { requireRole } = require('../middleware/role.middleware');
const { validateBody } = require('../middleware/validation.middleware');

const router = express.Router();

router.use(requireRole('therapist'));

const createSessionSchema = Joi.object({
  studentId: Joi.number().integer().required(),
  type: Joi.string().valid('live', 'assessment', 'follow_up').default('live'),
  scheduledTime: Joi.date().iso().allow(null),
});

const pushContentSchema = Joi.object({
  // `type` is accepted as an alias of `contentType`.
  contentType: Joi.string(),
  type: Joi.string(),
  contentId: Joi.number().integer().required(),
  phonemeId: Joi.number().integer(),
})
  .or('contentType', 'type')
  .rename('type', 'contentType', { override: false, ignoreUndefined: true });

const noteSchema = Joi.object({
  // `notes` is accepted as an alias of `note`.
  note: Joi.string().min(1),
  notes: Joi.string().min(1),
  recommendation: Joi.string().allow(null, ''),
  score: Joi.number().allow(null),
  targetPhoneme: Joi.string().allow(null, ''),
})
  .or('note', 'notes')
  .rename('notes', 'note', { override: false, ignoreUndefined: true });

router.post('/', validateBody(createSessionSchema), sessionController.createSession);
router.post('/:sessionId/start', sessionController.startSession);
router.post('/:sessionId/push-content', validateBody(pushContentSchema), sessionController.pushContent);
router.post('/:sessionId/notes', validateBody(noteSchema), sessionController.addNote);

module.exports = router;
