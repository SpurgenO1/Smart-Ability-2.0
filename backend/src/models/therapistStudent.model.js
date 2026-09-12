'use strict';

const db = require('../config/database');

const TABLE = 'therapist_student';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  isAssigned(therapistId, studentId) {
    return db(TABLE)
      .where({ therapist_id: therapistId, student_id: studentId, status: 'active' })
      .first();
  },
  listStudentIdsForTherapist(therapistId) {
    return db(TABLE)
      .where({ therapist_id: therapistId, status: 'active' })
      .pluck('student_id');
  },
  listTherapistsForStudent(studentId) {
    return db(TABLE).where({ student_id: studentId, status: 'active' });
  },
};
