'use strict';

const db = require('../config/database');

const TABLE = 'parent_student';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  isLinked(parentId, studentId) {
    return db(TABLE)
      .where({ parent_id: parentId, student_id: studentId, status: 'active' })
      .first();
  },
  listStudentIdsForParent(parentId) {
    return db(TABLE).where({ parent_id: parentId, status: 'active' }).pluck('student_id');
  },
  listForStudent(studentId) {
    return db(TABLE).where({ student_id: studentId, status: 'active' });
  },
};
