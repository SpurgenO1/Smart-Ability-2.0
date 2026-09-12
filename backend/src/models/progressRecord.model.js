'use strict';

const db = require('../config/database');

const TABLE = 'progress_records';

module.exports = {
  findOne(studentId, phonemeId) {
    return db(TABLE).where({ student_id: studentId, phoneme_id: phonemeId }).first();
  },
  listByStudent(studentId) {
    return db(TABLE).where({ student_id: studentId });
  },
  async upsert(studentId, phonemeId, masteryStatus) {
    const existing = await module.exports.findOne(studentId, phonemeId);
    if (existing) {
      return db(TABLE)
        .where({ id: existing.id })
        .update({ mastery_status: masteryStatus, updated_at: db.fn.now() })
        .returning('*')
        .then((rows) => rows[0]);
    }
    return db(TABLE)
      .insert({ student_id: studentId, phoneme_id: phonemeId, mastery_status: masteryStatus })
      .returning('*')
      .then((rows) => rows[0]);
  },
};
