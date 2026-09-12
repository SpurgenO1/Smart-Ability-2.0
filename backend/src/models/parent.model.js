'use strict';

const db = require('../config/database');

const TABLE = 'parents';

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
};
