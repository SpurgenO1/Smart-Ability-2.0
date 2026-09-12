'use strict';

const express = require('express');
const Joi = require('joi');
const alertController = require('../controllers/alert.controller');
const { requireRole } = require('../middleware/role.middleware');
const { validateBody } = require('../middleware/validation.middleware');

const router = express.Router();

router.use(requireRole('therapist'));

const unlockSchema = Joi.object({
  // Optional: when omitted, the content tied to the alert's phoneme is
  // unlocked automatically.
  contentId: Joi.number().integer(),
  message: Joi.string().allow(null, '').max(1000),
  sendNotification: Joi.boolean().default(true),
});

const rejectSchema = Joi.object({
  reason: Joi.string().allow(null, '').max(1000),
  sendNotification: Joi.boolean().default(true),
});

router.get('/', alertController.listAlerts);
router.get('/:alertId', alertController.getAlert);
router.post('/:alertId/unlock', validateBody(unlockSchema), alertController.unlockAlert);
router.post('/:alertId/reject', validateBody(rejectSchema), alertController.rejectAlert);

module.exports = router;
