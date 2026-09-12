'use strict';

const db = require('../config/database');

const TABLE = 'audio_files';

module.exports = {
  create(data) {
    return db(TABLE).insert(data).returning('*').then((rows) => rows[0]);
  },
  findByFileId(fileId) {
    return db(TABLE).where({ file_id: fileId }).first();
  },
  updateByFileId(fileId, data) {
    return db(TABLE).where({ file_id: fileId }).update(data).returning('*').then((rows) => rows[0]);
  },
};
