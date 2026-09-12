'use strict';

const db = require('../config/database');

const TABLE = 'audit_logs';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  listForUser(userId) {
    return db(TABLE).where({ user_id: userId }).orderBy('timestamp', 'desc');
  },
};
