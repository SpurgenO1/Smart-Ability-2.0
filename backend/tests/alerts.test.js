'use strict';

const { resetDatabase, db } = require('./setup');
const {
  request,
  app,
  registerAndLogin,
  assignTherapistToStudent,
  createPhoneme,
  authHeader,
} = require('./helpers');

async function triggerFiveFailureAlert() {
  const therapist = await registerAndLogin('therapist');
  const student = await registerAndLogin('student');
  await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
  const phoneme = await createPhoneme();
  await db('three_d_content').insert({
    phoneme_id: phoneme.id,
    model_url: `content/${phoneme.name}/model.glb`,
    animation_url: `content/${phoneme.name}/mouth-animation.mp4`,
    video_url: `content/${phoneme.name}/tutorial.mp4`,
  });

  const sessionRes = await request(app)
    .post('/api/v1/practice/sessions')
    .set(authHeader(student.accessToken))
    .send({ studentId: student.roleEntity.id, phonemeId: phoneme.id });
  const sessionId = sessionRes.body.data.sessionId;

  for (let i = 1; i <= 5; i += 1) {
    await request(app)
      .post(`/api/v1/practice/sessions/${sessionId}/attempts`)
      .set(authHeader(student.accessToken))
      .send({
        attemptNumber: i,
        recognizedText: 'wrong',
        recognitionConfidence: 0.9,
        audioFeatures: { matchScore: 0.9 },
        mouthFeatures: { matchScore: 0.9 },
      });
  }

  const [content] = await db('three_d_content').where({ phoneme_id: phoneme.id });

  return { therapist, student, phoneme, content };
}

describe('alerts + content unlock', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('therapist sees the pending alert and can unlock content for the student', async () => {
    const { therapist, phoneme, content } = await triggerFiveFailureAlert();

    const listRes = await request(app).get('/api/v1/alerts').set(authHeader(therapist.accessToken));
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.alerts).toHaveLength(1);
    const alert = listRes.body.data.alerts[0];
    expect(alert.status).toBe('pending');
    expect(alert.phonemeId).toBe(phoneme.id);

    const unlockRes = await request(app)
      .post(`/api/v1/alerts/${alert.id}/unlock`)
      .set(authHeader(therapist.accessToken))
      .send({ contentId: content.id, message: 'Try this 3D mouth animation!' });

    expect(unlockRes.status).toBe(201);
    expect(unlockRes.body.data.status).toBe('active');

    const updatedAlert = await db('struggle_alerts').where({ id: alert.id }).first();
    expect(updatedAlert.status).toBe('unlocked');
  });

  test('a therapist not assigned to the alert cannot view or unlock it', async () => {
    const { phoneme, content } = await triggerFiveFailureAlert();
    const outsider = await registerAndLogin('therapist');

    const alerts = await db('struggle_alerts').where({ phoneme_id: phoneme.id });
    const alertId = alerts[0].id;

    const getRes = await request(app).get(`/api/v1/alerts/${alertId}`).set(authHeader(outsider.accessToken));
    expect(getRes.status).toBe(403);

    const unlockRes = await request(app)
      .post(`/api/v1/alerts/${alertId}/unlock`)
      .set(authHeader(outsider.accessToken))
      .send({ contentId: content.id });
    expect(unlockRes.status).toBe(403);
  });
});
