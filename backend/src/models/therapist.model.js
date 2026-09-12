'use strict';

const db = require('../config/database');

const TABLE = 'therapists';

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
  findByIdWithName(id) {
    return db(`${TABLE} as t`)
      .join('users as u', 'u.id', 't.user_id')
      .where('t.id', id)
      .select('t.*', 'u.name as therapist_name')
      .first();
  },
};
