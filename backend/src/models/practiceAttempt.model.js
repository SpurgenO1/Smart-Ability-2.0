'use strict';

const db = require('../config/database');

const TABLE = 'practice_attempts';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  /**
   * Most recent attempts for a student+phoneme, newest first. Used to
   * server-side recompute the consecutive-failure streak - never trust a
   * client-supplied count.
   */
  recentForStudentPhoneme(studentId, phonemeId, limit = 50) {
    return db(TABLE)
      .where({ student_id: studentId, phoneme_id: phonemeId })
      .orderBy('id', 'desc')
      .limit(limit);
  },
  countForStudent(studentId) {
    return db(TABLE).where({ student_id: studentId }).count('id as count').first();
  },
  countForStudentSince(studentId, since) {
    return db(TABLE)
      .where({ student_id: studentId })
      .andWhere('created_at', '>=', since)
      .count('id as count')
      .first();
  },
};
