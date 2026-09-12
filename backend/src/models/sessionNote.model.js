'use strict';

const db = require('../config/database');

const TABLE = 'session_notes';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  listBySession(sessionId) {
    return db(TABLE).where({ session_id: sessionId }).orderBy('created_at', 'desc');
  },
};
