'use strict';

const crypto = require('crypto');

/**
 * Minimal signed-URL storage abstraction.
 *
 * In real deployments this would wrap S3/GCS/MinIO presigned URLs. To keep
 * the audio upload flow self-contained (no external bucket required to run
 * this backend), we implement a local signed-URL scheme: the "upload URL" is
 * a path on this API, HMAC-signed with an expiry, that the client PUTs bytes
 * to. Swapping STORAGE_PROVIDER to s3/gcs later only means changing this
 * module - callers never see the difference.
 */
const SECRET = process.env.STORAGE_ACCESS_KEY || 'dev-storage-secret-change-me';
const TTL_SECONDS = Number(process.env.STORAGE_SIGNED_URL_TTL_SECONDS) || 300;

function sign(fileId, expiresAt) {
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${fileId}.${expiresAt}`)
    .digest('hex');
}

function generateUploadUrl(fileId) {
  const expiresAt = Date.now() + TTL_SECONDS * 1000;
  const signature = sign(fileId, expiresAt);
  return {
    uploadUrl: `/api/v1/audio/raw/${fileId}?expires=${expiresAt}&sig=${signature}`,
    expiresIn: TTL_SECONDS,
  };
}

function generatePlaybackUrl(fileId) {
  const expiresAt = Date.now() + TTL_SECONDS * 1000;
  const signature = sign(fileId, expiresAt);
  return `/api/v1/audio/raw/${fileId}?expires=${expiresAt}&sig=${signature}`;
}

function verifySignature(fileId, expires, signature) {
  if (!expires || !signature) return false;
  if (Date.now() > Number(expires)) return false;
  const expected = sign(fileId, expires);
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = {
  provider: process.env.STORAGE_PROVIDER || 'local',
  bucket: process.env.STORAGE_BUCKET || 'echoseed-audio',
  ttlSeconds: TTL_SECONDS,
  generateUploadUrl,
  generatePlaybackUrl,
  verifySignature,
};
