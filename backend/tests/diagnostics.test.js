'use strict';

const { resetDatabase, db } = require('./setup');
const { request, app, registerAndLogin, createPhoneme, authHeader } = require('./helpers');

describe('diagnostics', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('aggregates diagnostic_results by feature and lists affected phonemes', async () => {
    const student = await registerAndLogin('student');
    const retroflexPhoneme = await createPhoneme({ character: 'ट', name: 'Ta', category: 'retroflex' });

    const [feature] = await db('articulatory_features')
      .insert({ feature_name: 'retroflex_place', description: 'tongue tip curled back' })
      .returning('*');
    await db('phoneme_features').insert({ phoneme_id: retroflexPhoneme.id, feature_id: feature.id });

    await db('diagnostic_results').insert([
      { student_id: student.roleEntity.id, feature: 'retroflex_place', confidence: 0.6, evidence: {} },
      { student_id: student.roleEntity.id, feature: 'retroflex_place', confidence: 0.82, evidence: {} },
    ]);

    const res = await request(app)
      .get(`/api/v1/diagnostics/${student.roleEntity.id}`)
      .set(authHeader(student.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.suspectedFeatures).toHaveLength(1);
    expect(res.body.data.suspectedFeatures[0]).toMatchObject({
      feature: 'retroflex_place',
      confidence: 0.82,
      affectedPhonemes: ['ट'],
    });
  });
});
