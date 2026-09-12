'use strict';

const db = require('../config/database');

const TABLE = 'users';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  findByEmail(email) {
    return db(TABLE).where({ email }).first();
  },
  findByEmailOrName(identifier) {
    const clean = (identifier || '').toLowerCase().trim();
    return db(TABLE)
      .whereRaw('LOWER(email) = ?', [clean])
      .orWhereRaw('LOWER(name) = ?', [clean])
      .first();
  },
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  updateTimestamp(id) {
    return db(TABLE).where({ id }).update({ updated_at: db.fn.now() });
  },
};
