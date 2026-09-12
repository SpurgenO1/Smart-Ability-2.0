'use strict';

const db = require('../config/database');

const TABLE = 'phonemes';

module.exports = {
  list({ category } = {}) {
    let q = db(TABLE).where({ active: true });
    if (category) {
      q = q.andWhere({ category });
    }
    return q.orderBy('id', 'asc');
  },
  findById(id) {
    return db(TABLE).where({ id }).first();
  },
  findByIdActive(id) {
    return db(TABLE).where({ id, active: true }).first();
  },
  findByCharacter(character) {
    return db(TABLE).where({ character }).first();
  },
  getFeatures(phonemeId) {
    return db('phoneme_features as pf')
      .join('articulatory_features as af', 'af.id', 'pf.feature_id')
      .where('pf.phoneme_id', phonemeId)
      .select('af.id', 'af.feature_name', 'af.description');
  },
  getThreeDContent(phonemeId) {
    return db('three_d_content').where({ phoneme_id: phonemeId }).first();
  },
};
