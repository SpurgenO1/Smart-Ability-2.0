'use strict';

const progressRecordModel = require('../models/progressRecord.model');
const practiceDailyStatModel = require('../models/practiceDailyStat.model');
const db = require('../config/database');
const authConfig = require('../config/auth');

const { masteryMinAccuracy, masteryMinAttempts } = authConfig.business;

/**
 * Recomputes mastery_status for a student+phoneme from attempt history.
 * Thresholds (min accuracy, min attempts) are engineering config only -
 * this is not a clinical diagnosis.
 */
async function recalculateMastery(studentId, phonemeId) {
  const stats = await db('practice_attempts')
    .where({ student_id: studentId, phoneme_id: phonemeId })
    .select(db.raw("count(*) as total"), db.raw("sum(case when result = 'pass' then 1 else 0 end) as passes"));

  const total = Number(stats[0]?.total || 0);
  const passes = Number(stats[0]?.passes || 0);
  const accuracy = total > 0 ? passes / total : 0;

  let masteryStatus = 'not_started';
  if (total > 0) {
    masteryStatus = 'in_progress';
    if (total >= masteryMinAttempts && accuracy >= masteryMinAccuracy) {
      masteryStatus = 'mastered';
    }
  }

  return progressRecordModel.upsert(studentId, phonemeId, masteryStatus);
}

async function getStudentProgress(studentId) {
  return progressRecordModel.listByStudent(studentId);
}

async function getPracticeFrequency(studentId, range = {}) {
  return practiceDailyStatModel.listByStudent(studentId, range);
}

module.exports = { recalculateMastery, getStudentProgress, getPracticeFrequency };
