'use strict';

process.env.NODE_ENV = 'test';
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.CONSECUTIVE_FAILURE_THRESHOLD = '5';
process.env.MASTERY_MIN_ACCURACY = '0.85';
process.env.MASTERY_MIN_ATTEMPTS = '10';

const path = require('path');
const db = require('../src/config/database');
const { resetRateLimitStores } = require('../src/middleware/rateLimit.middleware');

// Child-first order so deletes never violate foreign keys.
const TABLES_CHILD_FIRST = [
  'audit_logs',
  'notifications',
  'practice_daily_stats',
  'progress_records',
  'session_notes',
  'therapy_sessions',
  'content_unlocks',
  'three_d_content',
  'struggle_alerts',
  'diagnostic_results',
  'audio_files',
  'practice_attempts',
  'practice_sessions',
  'phoneme_features',
  'articulatory_features',
  'phonemes',
  'parent_student',
  'therapist_student',
  'parents',
  'therapists',
  'students',
  'users',
];

let migrated = false;

async function ensureMigrated() {
  if (migrated) return;
  await db.migrate.latest({ directory: path.join(__dirname, '..', 'migrations') });
  migrated = true;
}

/**
 * Clears all data between tests without dropping/recreating the schema -
 * pg-mem (the in-memory Postgres used for tests) doesn't reliably support
 * repeated drop-table/create-table cycles with the same index names, so we
 * migrate once per test file and just delete rows here instead.
 */
async function resetDatabase() {
  await ensureMigrated();
  for (const table of TABLES_CHILD_FIRST) {
    await db(table).del();
  }
  resetRateLimitStores();
}

module.exports = { db, resetDatabase };
