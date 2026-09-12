'use strict';

const practiceSessionModel = require('../models/practiceSession.model');
const practiceAttemptModel = require('../models/practiceAttempt.model');
const practiceDailyStatModel = require('../models/practiceDailyStat.model');
const phonemeModel = require('../models/phoneme.model');
const therapistStudentModel = require('../models/therapistStudent.model');
const parentStudentModel = require('../models/parentStudent.model');
const evaluationService = require('./evaluation.service');
const alertService = require('./alert.service');
const progressService = require('./progress.service');
const authConfig = require('../config/auth');
const { emitToRoom, roomFor } = require('../websocket/socket');
const { ApiError } = require('../utils/errors');

const FAILURE_THRESHOLD = authConfig.business.consecutiveFailureThreshold;

/**
 * PROGRESS_UPDATED is documented as Server -> Client (Parent & Therapist),
 * so it broadcasts to every therapist assigned to and parent linked to the
 * student, in addition to the student's own room.
 */
async function broadcastProgressUpdated(studentId, phonemeId, masteryStatus) {
  const payload = { studentId, phonemeId, newStatus: String(masteryStatus).toUpperCase() };

  emitToRoom(roomFor('student', studentId), 'PROGRESS_UPDATED', payload);

  const [therapistLinks, parentLinks] = await Promise.all([
    therapistStudentModel.listTherapistsForStudent(studentId),
    parentStudentModel.listForStudent(studentId),
  ]);
  therapistLinks.forEach((link) => emitToRoom(roomFor('therapist', link.therapist_id), 'PROGRESS_UPDATED', payload));
  parentLinks.forEach((link) => emitToRoom(roomFor('parent', link.parent_id), 'PROGRESS_UPDATED', payload));
}

async function createSession({ studentId, phonemeId, mode }) {
  const phoneme = await phonemeModel.findByIdActive(phonemeId);
  if (!phoneme) throw new ApiError('PHONEME_NOT_FOUND', 'Phoneme not found');

  const session = await practiceSessionModel.create({
    student_id: studentId,
    phoneme_id: phonemeId,
    mode: mode || 'self_practice',
    status: 'active',
  });

  await practiceDailyStatModel.incrementForToday(studentId, { sessions: 1 });

  return session;
}

/**
 * Recomputes the consecutive-failure streak for a student+phoneme purely
 * from stored attempt history (most recent attempts first), ignoring
 * whatever the client submitted. Walks backwards until it hits a 'pass'
 * or runs out of history.
 */
async function recomputeConsecutiveFailures(studentId, phonemeId) {
  const recent = await practiceAttemptModel.recentForStudentPhoneme(studentId, phonemeId, 100);
  let count = 0;
  for (const attempt of recent) {
    if (attempt.result === 'fail') {
      count += 1;
    } else {
      break;
    }
  }
  return count;
}

async function recordAttempt({ session, studentId, attemptInput }) {
  if (session.student_id !== studentId) {
    throw new ApiError('ATTEMPT_INVALID', 'Session does not belong to this student');
  }
  if (session.status !== 'active') {
    throw new ApiError('ATTEMPT_INVALID', 'Session is not active');
  }

  const phonemeId = session.phoneme_id;
  const phoneme = await phonemeModel.findById(phonemeId);
  if (!phoneme) throw new ApiError('PHONEME_NOT_FOUND', 'Phoneme not found');

  const { attemptNumber, recognizedText, recognitionConfidence, audioFeatures, mouthFeatures, audioUrl } = attemptInput;

  if (!Number.isInteger(attemptNumber) || attemptNumber < 1) {
    throw new ApiError('ATTEMPT_INVALID', 'attemptNumber must be a positive integer');
  }

  const { result } = evaluationService.evaluateAttempt({
    targetPhoneme: phoneme.character,
    recognizedText,
    recognitionConfidence,
    audioFeatures,
    mouthFeatures,
  });

  // Server-side truth: recompute the streak from history BEFORE this
  // attempt, then derive the new count. The client's failureCount (if any
  // was sent) is never read or trusted.
  const priorConsecutiveFailures = await recomputeConsecutiveFailures(studentId, phonemeId);
  const newConsecutiveFailures = result === 'fail' ? priorConsecutiveFailures + 1 : 0;

  const attempt = await practiceAttemptModel.create({
    session_id: session.id,
    student_id: studentId,
    phoneme_id: phonemeId,
    attempt_number: attemptNumber,
    recognized_text: recognizedText || null,
    recognition_confidence: recognitionConfidence != null ? Number(recognitionConfidence) : null,
    result,
    consecutive_failure_count: newConsecutiveFailures,
    audio_feature_json: audioFeatures || null,
    mouth_feature_json: mouthFeatures || null,
    audio_url: audioUrl || null,
  });

  await practiceDailyStatModel.incrementForToday(studentId, { attempts: 1 });

  let therapistAlertTriggered = false;
  if (result === 'fail' && newConsecutiveFailures === FAILURE_THRESHOLD) {
    const alert = await alertService.createAlertIfNeeded({
      studentId,
      phonemeId,
      triggerAttemptId: attempt.id,
      failureCount: newConsecutiveFailures,
      phonemeCharacter: phoneme.character,
    });
    therapistAlertTriggered = Boolean(alert);
  }

  const progressRecord = await progressService.recalculateMastery(studentId, phonemeId);
  await broadcastProgressUpdated(studentId, phonemeId, progressRecord.mastery_status);

  return {
    attemptId: attempt.id,
    result,
    consecutiveFailures: newConsecutiveFailures,
    therapistAlertTriggered,
  };
}

module.exports = { createSession, recordAttempt, recomputeConsecutiveFailures };
