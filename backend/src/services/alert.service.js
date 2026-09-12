'use strict';

const struggleAlertModel = require('../models/struggleAlert.model');
const therapistStudentModel = require('../models/therapistStudent.model');
const parentStudentModel = require('../models/parentStudent.model');
const parentModel = require('../models/parent.model');
const studentModel = require('../models/student.model');
const contentUnlockModel = require('../models/contentUnlock.model');
const threeDContentModel = require('../models/threeDContent.model');
const notificationService = require('./notification.service');
const { emitToRoom, roomFor } = require('../websocket/socket');
const { ApiError } = require('../utils/errors');
const storage = require('../config/storage');

/**
 * Creates a struggle_alerts row for a student+phoneme failure streak,
 * unless a 'pending' alert for that exact student+phoneme already exists
 * (prevents duplicate alerts for the same 5-failure sequence). Returns
 * null when no alert was created.
 */
async function createAlertIfNeeded({ studentId, phonemeId, triggerAttemptId, failureCount, phonemeCharacter }) {
  const existingPending = await struggleAlertModel.findPending(studentId, phonemeId);
  if (existingPending) {
    return null;
  }

  const assignments = await therapistStudentModel.listTherapistsForStudent(studentId);
  if (!assignments.length) {
    // No assigned therapist to notify - nothing more we can do server-side.
    return null;
  }
  const therapistId = assignments[0].therapist_id;

  const alert = await struggleAlertModel.create({
    student_id: studentId,
    therapist_id: therapistId,
    phoneme_id: phonemeId,
    trigger_attempt_id: triggerAttemptId,
    failure_count: failureCount,
    status: 'pending',
  });

  emitToRoom(roomFor('student', studentId), 'STUDENT_FAILURE_THRESHOLD', {
    alertId: alert.id,
    studentId,
    phoneme: phonemeCharacter,
    failureCount,
  });

  const student = await studentModel.findById(studentId);
  emitToRoom(roomFor('therapist', therapistId), 'THERAPIST_ALERT_CREATED', {
    alertId: alert.id,
    studentId,
    studentName: student ? student.display_name : null,
    phoneme: phonemeCharacter,
  });

  await notifyParents(studentId, alert, phonemeCharacter);

  return alert;
}

async function notifyParents(studentId, alert, phonemeCharacter) {
  const links = await parentStudentModel.listForStudent(studentId);
  await Promise.all(
    links.map(async (link) => {
      const parent = await parentModel.findById(link.parent_id);
      if (!parent) return;
      await notificationService.notify({
        recipientId: parent.user_id,
        type: 'struggle_alert',
        title: 'Practice update',
        message: `Your child may need extra support with ${phonemeCharacter || 'a sound'}.`,
        referenceType: 'struggle_alert',
        referenceId: alert.id,
      });
    })
  );
}

async function getAlertForTherapistOrThrow(alertId, therapistId) {
  const alert = await struggleAlertModel.findById(alertId);
  if (!alert) throw new ApiError('ALERT_NOT_FOUND', 'Alert not found');
  if (alert.therapist_id !== therapistId) {
    throw new ApiError('FORBIDDEN_RESOURCE', 'You are not assigned to this alert');
  }
  return alert;
}

async function unlockContent({ alertId, therapistId, contentId, message, sendNotification = true }) {
  const alert = await getAlertForTherapistOrThrow(alertId, therapistId);

  // contentId is optional: each phoneme has exactly one 3D content bundle,
  // so when the caller doesn't name one explicitly we resolve it from the
  // alert's phoneme.
  const content = contentId
    ? await threeDContentModel.findById(contentId)
    : await threeDContentModel.findByPhonemeId(alert.phoneme_id);
  if (!content) {
    throw new ApiError('UNLOCK_NOT_FOUND', 'Content not found');
  }

  const unlock = await contentUnlockModel.create({
    student_id: alert.student_id,
    therapist_id: therapistId,
    phoneme_id: alert.phoneme_id,
    content_id: content.id,
    alert_id: alert.id,
    status: 'active',
  });

  await struggleAlertModel.updateStatus(alert.id, 'unlocked');

  emitToRoom(roomFor('student', alert.student_id), 'THREE_D_UNLOCKED', {
    studentId: alert.student_id,
    phonemeId: alert.phoneme_id,
    videoUrl: content.video_url ? storage.generatePlaybackUrl(content.video_url) : null,
    unlockId: unlock.id,
    contentId: content.id,
  });

  if (sendNotification) {
    const student = await studentModel.findById(alert.student_id);
    if (student) {
      await notificationService.notify({
        recipientId: student.user_id,
        type: 'content_unlocked',
        title: 'New practice content unlocked',
        message: message || 'Your therapist unlocked new practice content for you.',
        referenceType: 'content_unlock',
        referenceId: unlock.id,
      });
    }
  }

  return unlock;
}

module.exports = { createAlertIfNeeded, unlockContent, getAlertForTherapistOrThrow };
