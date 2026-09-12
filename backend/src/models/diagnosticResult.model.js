'use strict';

const db = require('../config/database');

const TABLE = 'diagnostic_results';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  listByStudent(studentId) {
    return db(TABLE).where({ student_id: studentId }).orderBy('created_at', 'desc');
  },
};
