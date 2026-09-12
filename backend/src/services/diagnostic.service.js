'use strict';

const diagnosticResultModel = require('../models/diagnosticResult.model');
const db = require('../config/database');

async function getSuspectedFeatures(studentId) {
  const results = await diagnosticResultModel.listByStudent(studentId);

  const byFeature = new Map();
  for (const row of results) {
    const existing = byFeature.get(row.feature);
    if (!existing || row.confidence > existing.confidence) {
      byFeature.set(row.feature, { feature: row.feature, confidence: row.confidence });
    }
  }

  const features = Array.from(byFeature.values());

  const suspectedFeatures = await Promise.all(
    features.map(async ({ feature, confidence }) => {
      const phonemes = await db('phoneme_features as pf')
        .join('articulatory_features as af', 'af.id', 'pf.feature_id')
        .join('phonemes as p', 'p.id', 'pf.phoneme_id')
        .where('af.feature_name', feature)
        .select('p.character');

      return {
        feature,
        confidence,
        affectedPhonemes: phonemes.map((p) => p.character),
      };
    })
  );

  suspectedFeatures.sort((a, b) => b.confidence - a.confidence);

  return { suspectedFeatures };
}

module.exports = { getSuspectedFeatures };
