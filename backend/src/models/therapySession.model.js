'use strict';

const db = require('../config/database');

const TABLE = 'therapy_sessions';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  updateStatus(id, status, extra = {}) {
    return db(TABLE)
      .where({ id })
      .update({ status, ...extra })
      .returning('*')
      .then((rows) => rows[0]);
  },
};
