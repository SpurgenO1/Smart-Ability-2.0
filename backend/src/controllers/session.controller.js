'use strict';

const therapySessionModel = require('../models/therapySession.model');
const sessionNoteModel = require('../models/sessionNote.model');
const therapistStudentModel = require('../models/therapistStudent.model');
const therapistModel = require('../models/therapist.model');
const threeDContentModel = require('../models/threeDContent.model');
const phonemeModel = require('../models/phoneme.model');
const auditService = require('../services/audit.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { ApiError } = require('../utils/errors');
const { emitToRoom, roomFor } = require('../websocket/socket');
const storage = require('../config/storage');

async function loadOwnedSession(req) {
  const session = await therapySessionModel.findById(Number(req.params.sessionId));
  if (!session) throw new ApiError('SESSION_NOT_FOUND', 'Live session not found');
  if (session.therapist_id !== req.roleEntity.id) {
    throw new ApiError('FORBIDDEN_RESOURCE', 'You do not own this session');
  }
  return session;
}

const createSession = asyncHandler(async (req, res) => {
  const { studentId, type, scheduledTime } = req.body;
  const therapistId = req.roleEntity.id;

  const assignment = await therapistStudentModel.isAssigned(therapistId, studentId);
  if (!assignment) {
    throw new ApiError('FORBIDDEN_RESOURCE', 'You are not assigned to this student');
  }

  const session = await therapySessionModel.create({
    student_id: studentId,
    therapist_id: therapistId,
    type: type || 'live',
    status: 'scheduled',
    scheduled_time: scheduledTime || null,
  });

  return success(res, { sessionId: session.id, status: session.status }, 201);
});

const startSession = asyncHandler(async (req, res) => {
  const session = await loadOwnedSession(req);

  const updated = await therapySessionModel.updateStatus(session.id, 'active', { started_at: new Date() });
  const therapist = await therapistModel.findByIdWithName(req.roleEntity.id);

  await auditService.record(req.user.id, auditService.ACTIONS.SESSION_START, session.id);

  // Placeholder signaling-channel reference - swap for a real media/SFU
  // provider URL once one is wired in; the room key (sessionId) is stable.
  const streamUrl = `/live/${session.id}`;

  emitToRoom(roomFor('student', session.student_id), 'SESSION_STARTED', {
    sessionId: session.id,
    therapistName: therapist ? therapist.therapist_name : null,
    streamUrl,
  });

  return success(res, {
    sessionId: updated.id,
    status: updated.status,
    startedAt: updated.started_at,
    streamUrl,
  });
});

const pushContent = asyncHandler(async (req, res) => {
  const session = await loadOwnedSession(req);
  const { contentId, phonemeId } = req.body;
  const contentType = req.body.contentType || req.body.type;

  const content = await threeDContentModel.findById(contentId);
  if (!content) throw new ApiError('UNLOCK_NOT_FOUND', 'Content not found');

  const resolvedPhonemeId = phonemeId || content.phoneme_id;
  const contentUrl = content.video_url
    ? storage.publicMediaUrl(content.video_url)
    : content.model_url
    ? storage.publicMediaUrl(content.model_url)
    : null;

  emitToRoom(roomFor('student', session.student_id), 'CONTENT_PUSHED', {
    sessionId: session.id,
    contentUrl,
    contentType,
    contentId,
    phonemeId: resolvedPhonemeId,
  });

  return success(res, { sessionId: session.id, contentType, contentId, contentUrl, phonemeId: resolvedPhonemeId });
});

const addNote = asyncHandler(async (req, res) => {
  const session = await loadOwnedSession(req);
  const note = req.body.note || req.body.notes;
  const { recommendation, score, targetPhoneme } = req.body;

  let targetPhonemeId = null;
  if (targetPhoneme) {
    const phoneme = await phonemeModel.findByCharacter(targetPhoneme);
    if (!phoneme) throw new ApiError('PHONEME_NOT_FOUND', 'targetPhoneme does not match a known phoneme');
    targetPhonemeId = phoneme.id;
  }

  const created = await sessionNoteModel.create({
    session_id: session.id,
    therapist_id: req.roleEntity.id,
    student_id: session.student_id,
    note,
    recommendation: recommendation || null,
    score: score != null ? Number(score) : null,
    target_phoneme_id: targetPhonemeId,
  });

  await auditService.record(req.user.id, auditService.ACTIONS.NOTE_CREATED, created.id);

  return success(
    res,
    {
      noteId: created.id,
      sessionId: created.session_id,
      note: created.note,
      recommendation: created.recommendation,
      score: created.score,
      targetPhoneme: targetPhoneme || null,
      createdAt: created.created_at,
    },
    201
  );
});

module.exports = { createSession, startSession, pushContent, addNote };
