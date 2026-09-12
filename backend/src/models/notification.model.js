'use strict';

const db = require('../config/database');

const TABLE = 'notifications';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  listForRecipient(recipientId) {
    return db(TABLE).where({ recipient_id: recipientId }).orderBy('created_at', 'desc');
  },
};
