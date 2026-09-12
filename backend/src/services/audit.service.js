'use strict';

const auditLogModel = require('../models/auditLog.model');

const ACTIONS = {
  LOGIN: 'LOGIN',
  STUDENT_VIEW: 'STUDENT_VIEW',
  ALERT_VIEW: 'ALERT_VIEW',
  THREE_D_UNLOCK: 'THREE_D_UNLOCK',
  SESSION_START: 'SESSION_START',
  NOTE_CREATED: 'NOTE_CREATED',
  AUDIO_ACCESS: 'AUDIO_ACCESS',
  PROFILE_UPDATED: 'PROFILE_UPDATED',
};

async function record(userId, action, resourceId) {
  try {
    await auditLogModel.create({
      user_id: userId ?? null,
      action,
      resource_id: resourceId != null ? String(resourceId) : null,
    });
  } catch (err) {
    // Auditing must never break the primary request flow.
    // eslint-disable-next-line no-console
    console.error('audit log write failed', err.message);
  }
}

module.exports = { record, ACTIONS };
