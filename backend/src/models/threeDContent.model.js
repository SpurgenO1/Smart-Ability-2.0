'use strict';

const db = require('../config/database');

const TABLE = 'three_d_content';

module.exports = {
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  findByPhonemeId(phonemeId) {
    return db(TABLE).where({ phoneme_id: phonemeId }).first();
  },
};
