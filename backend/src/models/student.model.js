'use strict';

const db = require('../config/database');

const TABLE = 'students';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  findByUserId(userId) {
    return db(TABLE).where({ user_id: userId }).first();
  },
  listByIds(ids) {
    if (!ids.length) return Promise.resolve([]);
    return db(TABLE).whereIn('id', ids);
  },
};
