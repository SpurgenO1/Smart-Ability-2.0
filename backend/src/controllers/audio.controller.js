'use strict';

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const audioFileModel = require('../models/audioFile.model');
const practiceAttemptModel = require('../models/practiceAttempt.model');
const practiceSessionModel = require('../models/practiceSession.model');
const auditService = require('../services/audit.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { ApiError } = require('../utils/errors');
const storage = require('../config/storage');

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'audio');

function ensureUploadDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const requestUploadUrl = asyncHandler(async (req, res) => {
  const { durationMs, sampleRate, channels, fileName } = req.body || {};
  // `fileType` is accepted as an alias of `format`.
  const format = req.body?.format || req.body?.fileType || null;
  const fileId = uuidv4();

  await audioFileModel.create({
    file_id: fileId,
    format,
    duration_ms: durationMs || null,
    sample_rate: sampleRate || null,
    channels: channels || null,
    size_bytes: null,
    original_filename: fileName || null,
    // Only students ever record practice audio (enforced by requireRole on
    // this route) - tagging the owner up front is what lets completeUpload
    // and any future playback endpoint enforce ownership like every other
    // student-scoped resource in this API.
    student_id: req.roleEntity.id,
  });

  const { uploadUrl, expiresIn } = storage.generateUploadUrl(fileId);

  return success(res, { uploadUrl, fileId, expiresIn }, 201);
});

const uploadRaw = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { expires, sig } = req.query;

  if (!storage.verifySignature(fileId, expires, sig)) {
    throw new ApiError('FILE_UPLOAD_FAILED', 'Invalid or expired upload URL');
  }

  const audioFile = await audioFileModel.findByFileId(fileId);
  if (!audioFile) {
    throw new ApiError('FILE_UPLOAD_FAILED', 'Unknown fileId');
  }

  ensureUploadDir();
  const bodyBuffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from([]);
  fs.writeFileSync(path.join(UPLOAD_DIR, fileId), bodyBuffer);

  await audioFileModel.updateByFileId(fileId, { size_bytes: bodyBuffer.length });

  return success(res, { fileId, sizeBytes: bodyBuffer.length });
});

// GET counterpart of the signed URL scheme above - same trust model as a
// presigned S3/GCS GET (the HMAC signature is the authorization, not a
// Bearer token), since a playback URL has to be embeddable directly in an
// <audio>/<video> src without attaching custom headers.
const downloadRaw = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { expires, sig } = req.query;

  if (!storage.verifySignature(fileId, expires, sig)) {
    throw new ApiError('FILE_UPLOAD_FAILED', 'Invalid or expired playback URL');
  }

  const audioFile = await audioFileModel.findByFileId(fileId);
  if (!audioFile) {
    throw new ApiError('FILE_UPLOAD_FAILED', 'Unknown fileId');
  }

  const filePath = path.join(UPLOAD_DIR, fileId);
  if (!fs.existsSync(filePath)) {
    throw new ApiError('FILE_UPLOAD_FAILED', 'Audio has not finished uploading yet');
  }

  res.sendFile(filePath);
});

const completeUpload = asyncHandler(async (req, res) => {
  // `audioId` is accepted as an alias of `fileId`.
  const fileId = req.body.fileId || req.body.audioId;
  const { sessionId, attemptId, uploadPath } = req.body;

  const audioFile = await audioFileModel.findByFileId(fileId);
  if (!audioFile) {
    throw new ApiError('FILE_UPLOAD_FAILED', 'Unknown fileId');
  }

  // The file itself must belong to the caller - this is the check every
  // other student-scoped resource in this API gets via requireStudentAccess;
  // audio_files has no route-level ownership middleware, so it's done here.
  if (!req.roleEntity || audioFile.student_id !== req.roleEntity.id) {
    throw new ApiError('FORBIDDEN_RESOURCE', 'You may only complete your own audio upload');
  }

  if (sessionId) {
    const session = await practiceSessionModel.findById(sessionId);
    if (!session) throw new ApiError('SESSION_NOT_FOUND', 'Practice session not found');
    if (req.roleEntity.id !== session.student_id) {
      throw new ApiError('FORBIDDEN_RESOURCE', 'You may only attach audio to your own session');
    }
  }

  if (attemptId) {
    const attempt = await practiceAttemptModel.findById(attemptId);
    if (!attempt) throw new ApiError('ATTEMPT_INVALID', 'Attempt not found');
  }

  if (uploadPath) {
    await audioFileModel.updateByFileId(fileId, { upload_path: uploadPath });
  }

  await auditService.record(req.user.id, auditService.ACTIONS.AUDIO_ACCESS, fileId);

  return success(res, {
    fileId,
    status: 'attached',
    sessionId: sessionId || null,
    attemptId: attemptId || null,
  });
});

module.exports = { requestUploadUrl, uploadRaw, downloadRaw, completeUpload };
