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
    // Atomic upsert: two concurrent attempts for the same student on the
    // same day both increment relative to the row's current value in a
    // single statement, instead of read-then-write in JS which can lose an
    // update under concurrency (last writer wins, overwriting the other's
    // increment).
    const rows = await db(TABLE)
      .insert({ student_id: studentId, date: today, sessions, attempts })
      .onConflict(['student_id', 'date'])
      .merge({
        sessions: db.raw('?? + ?', [`${TABLE}.sessions`, sessions]),
        attempts: db.raw('?? + ?', [`${TABLE}.attempts`, attempts]),
      })
      .returning('*');
    return rows[0];
  },
};
