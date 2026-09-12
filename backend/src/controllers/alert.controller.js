'use strict';

const struggleAlertModel = require('../models/struggleAlert.model');
const alertService = require('../services/alert.service');
const auditService = require('../services/audit.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

function toDto(alert) {
  return {
    id: alert.id,
    studentId: alert.student_id,
    studentName: alert.student_name,
    phonemeId: alert.phoneme_id,
    phoneme: alert.phoneme_character,
    triggerAttemptId: alert.trigger_attempt_id,
    failureCount: alert.failure_count,
    status: alert.status,
    createdAt: alert.created_at,
    resolvedAt: alert.resolved_at,
  };
}

const listAlerts = asyncHandler(async (req, res) => {
  const alerts = await struggleAlertModel.listForTherapistEnriched(req.roleEntity.id, { status: req.query.status });
  return success(res, { alerts: alerts.map(toDto) });
});

const getAlert = asyncHandler(async (req, res) => {
  // Ownership check first (throws ALERT_NOT_FOUND / FORBIDDEN_RESOURCE),
  // then fetch the display-enriched row for the response.
  await alertService.getAlertForTherapistOrThrow(Number(req.params.alertId), req.roleEntity.id);
  const alert = await struggleAlertModel.findByIdEnriched(Number(req.params.alertId));

  await auditService.record(req.user.id, auditService.ACTIONS.ALERT_VIEW, alert.id);
  return success(res, toDto(alert));
});

const unlockAlert = asyncHandler(async (req, res) => {
  const { contentId, message, sendNotification } = req.body;

  const unlock = await alertService.unlockContent({
    alertId: Number(req.params.alertId),
    therapistId: req.roleEntity.id,
    contentId,
    message,
    sendNotification,
  });

  await auditService.record(req.user.id, auditService.ACTIONS.THREE_D_UNLOCK, unlock.id);

  return success(
    res,
    { unlockId: unlock.id, status: unlock.status, unlockedBy: req.roleEntity.id },
    201
  );
});

module.exports = { listAlerts, getAlert, unlockAlert };
