'use strict';

const practiceSessionModel = require('../models/practiceSession.model');
const therapistStudentModel = require('../models/therapistStudent.model');
const phonemeModel = require('../models/phoneme.model');
const practiceService = require('../services/practice.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { ApiError } = require('../utils/errors');

async function assertCanActForStudent(req, studentId) {
  if (req.user.role === 'student') {
    if (!req.roleEntity || req.roleEntity.id !== studentId) {
      throw new ApiError('FORBIDDEN_RESOURCE', 'You may only start sessions for yourself');
    }
    return;
  }
  if (req.user.role === 'therapist') {
    const assignment = req.roleEntity && (await therapistStudentModel.isAssigned(req.roleEntity.id, studentId));
    if (!assignment) {
      throw new ApiError('FORBIDDEN_RESOURCE', 'You are not assigned to this student');
    }
    return;
  }
  throw new ApiError('FORBIDDEN_RESOURCE', 'This role cannot start a practice session');
}

const createSession = asyncHandler(async (req, res) => {
  const { studentId, phonemeId, mode } = req.body;
  await assertCanActForStudent(req, studentId);

  const session = await practiceService.createSession({ studentId, phonemeId, mode });

  return success(
    res,
    { sessionId: session.id, status: session.status, startedAt: session.started_at },
    201
  );
});

const createAttempt = asyncHandler(async (req, res) => {
  const sessionId = Number(req.params.sessionId);
  const session = await practiceSessionModel.findById(sessionId);
  if (!session) throw new ApiError('SESSION_NOT_FOUND', 'Practice session not found');

  if (req.user.role !== 'student' || !req.roleEntity || req.roleEntity.id !== session.student_id) {
    throw new ApiError('FORBIDDEN_RESOURCE', 'You may only submit attempts for your own session');
  }

  const { targetPhoneme, attemptNumber, recognizedText, recognitionConfidence, audioFeatures, mouthFeatures, audioUrl } =
    req.body;

  if (targetPhoneme) {
    const phoneme = await phonemeModel.findById(session.phoneme_id);
    if (phoneme && phoneme.character !== targetPhoneme) {
      throw new ApiError('ATTEMPT_INVALID', 'targetPhoneme does not match this session');
    }
  }

  const result = await practiceService.recordAttempt({
    session,
    studentId: session.student_id,
    attemptInput: { attemptNumber, recognizedText, recognitionConfidence, audioFeatures, mouthFeatures, audioUrl },
  });

  return success(res, result, 201);
});

module.exports = { createSession, createAttempt };
