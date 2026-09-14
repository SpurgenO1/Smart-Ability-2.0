'use strict';

const db = require('../config/database');

const TABLE = 'practice_sessions';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  updateStatus(id, status) {
    return db(TABLE).where({ id }).update({ status }).returning('*').then((rows) => rows[0]);
  },
  abandonActiveForStudent(studentId) {
    return db(TABLE).where({ student_id: studentId, status: 'active' }).update({ status: 'abandoned' });
  },
};
