'use strict';

const db = require('../config/database');

const TABLE = 'practice_daily_stats';

module.exports = {
  listByStudent(studentId, { from, to } = {}) {
    let q = db(TABLE).where({ student_id: studentId });
    if (from) q = q.andWhere('date', '>=', from);
    if (to) q = q.andWhere('date', '<=', to);
    return q.orderBy('date', 'asc');
  },
  async incrementForToday(studentId, { sessions = 0, attempts = 0 }) {
    const today = new Date().toISOString().slice(0, 10);
    const existing = await db(TABLE).where({ student_id: studentId, date: today }).first();
    if (existing) {
      return db(TABLE)
        .where({ id: existing.id })
        .update({
          sessions: existing.sessions + sessions,
          attempts: existing.attempts + attempts,
        })
        .returning('*')
        .then((rows) => rows[0]);
    }
    return db(TABLE)
      .insert({ student_id: studentId, date: today, sessions, attempts })
      .returning('*')
      .then((rows) => rows[0]);
  },
};
