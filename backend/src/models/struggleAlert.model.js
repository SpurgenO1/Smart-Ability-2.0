'use strict';

const db = require('../config/database');

const TABLE = 'struggle_alerts';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  findPending(studentId, phonemeId) {
    return db(TABLE)
      .where({ student_id: studentId, phoneme_id: phonemeId, status: 'pending' })
      .first();
  },
  listForTherapist(therapistId, { status } = {}) {
    let q = db(TABLE).where({ therapist_id: therapistId });
    if (status) q = q.andWhere({ status });
    return q.orderBy('created_at', 'desc');
  },
  /**
   * Same as listForTherapist but joined with the student's display name and
   * the phoneme's character - saves the caller an N+1 lookup when rendering
   * a therapist's alert list/detail views.
   */
  listForTherapistEnriched(therapistId, { status } = {}) {
    let q = db(`${TABLE} as sa`)
      .join('students as s', 's.id', 'sa.student_id')
      .join('phonemes as p', 'p.id', 'sa.phoneme_id')
      .where('sa.therapist_id', therapistId);
    if (status) q = q.andWhere('sa.status', status);
    return q
      .orderBy('sa.created_at', 'desc')
      .select('sa.*', 's.display_name as student_name', 'p.character as phoneme_character');
  },
  findByIdEnriched(id) {
    return db(`${TABLE} as sa`)
      .join('students as s', 's.id', 'sa.student_id')
      .join('phonemes as p', 'p.id', 'sa.phoneme_id')
      .where('sa.id', id)
      .select('sa.*', 's.display_name as student_name', 'p.character as phoneme_character')
      .first();
  },
  updateStatus(id, status, extra = {}) {
    return db(TABLE)
      .where({ id })
      .update({ status, ...extra })
      .returning('*')
      .then((rows) => rows[0]);
  },
};
