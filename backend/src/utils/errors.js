'use strict';

const CODES = {
  AUTH_INVALID_CREDENTIALS: 401,
  AUTH_TOKEN_EXPIRED: 401,
  AUTH_UNAUTHORIZED: 401,
  FORBIDDEN_RESOURCE: 403,
  STUDENT_NOT_FOUND: 404,
  PHONEME_NOT_FOUND: 404,
  SESSION_NOT_FOUND: 404,
  ATTEMPT_INVALID: 422,
  ALERT_NOT_FOUND: 404,
  UNLOCK_NOT_FOUND: 404,
  INVALID_ROLE: 403,
  INVALID_REQUEST: 400,
  FILE_UPLOAD_FAILED: 400,
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  EMAIL_IN_USE: 409,
};

class ApiError extends Error {
  constructor(code, message, details) {
    super(message || code);
    this.code = code;
    this.status = CODES[code] || 500;
    this.details = details;
  }
}

module.exports = { ApiError, CODES };
