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
const alertService = require('../src/services/alert.service');

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

  test('therapist can reject/dismiss a struggle alert with clinical reason', async () => {
    const { therapist, phoneme } = await triggerFiveFailureAlert();

    const alerts = await db('struggle_alerts').where({ phoneme_id: phoneme.id });
    const alertId = alerts[0].id;

    const rejectRes = await request(app)
      .post(`/api/v1/alerts/${alertId}/reject`)
      .set(authHeader(therapist.accessToken))
      .send({ reason: 'Focus on in-person tactile placement cues first.' });

    expect(rejectRes.status).toBe(200);
    expect(rejectRes.body.data.status).toBe('dismissed');

    const updatedAlert = await db('struggle_alerts').where({ id: alertId }).first();
    expect(updatedAlert.status).toBe('dismissed');
  });

  test('unlocked demonstration video is visible strictly to the respective student and not to another student', async () => {
    const { therapist, student, phoneme, content } = await triggerFiveFailureAlert();

    // Create a second student who should NOT see the unlocked demonstration video
    const otherStudent = await registerAndLogin('student');

    const alerts = await db('struggle_alerts').where({ phoneme_id: phoneme.id });
    const alertId = alerts[0].id;

    // Therapist unlocks demonstration video for student 1
    const unlockRes = await request(app)
      .post(`/api/v1/alerts/${alertId}/unlock`)
      .set(authHeader(therapist.accessToken))
      .send({ contentId: content.id });
    expect(unlockRes.status).toBe(201);

    // Respective student checks their unlocked demonstrations: MUST have 1 unlock
    const studentDemosRes = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}/demonstrations`)
      .set(authHeader(student.accessToken));
    expect(studentDemosRes.status).toBe(200);
    expect(studentDemosRes.body.data.demonstrations).toHaveLength(1);
    expect(studentDemosRes.body.data.demonstrations[0].phonemeId).toBe(phoneme.id);

    // Other student checks their unlocked demonstrations: MUST HAVE 0 unlocks
    const otherDemosRes = await request(app)
      .get(`/api/v1/students/${otherStudent.roleEntity.id}/demonstrations`)
      .set(authHeader(otherStudent.accessToken));
    expect(otherDemosRes.status).toBe(200);
    expect(otherDemosRes.body.data.demonstrations).toHaveLength(0);
  });

  test('two concurrent 5th-failure triggers for the same student+phoneme create exactly one alert', async () => {
    const therapist = await registerAndLogin('therapist');
    const student = await registerAndLogin('student');
    await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
    const phoneme = await createPhoneme();

    const triggerAttempt = await db('practice_sessions')
      .insert({ student_id: student.roleEntity.id, phoneme_id: phoneme.id, mode: 'self_practice', status: 'active' })
      .returning('*')
      .then(async ([session]) => {
        const [attempt] = await db('practice_attempts')
          .insert({
            session_id: session.id,
            student_id: student.roleEntity.id,
            phoneme_id: phoneme.id,
            attempt_number: 5,
            result: 'fail',
            consecutive_failure_count: 5,
          })
          .returning('*');
        return attempt;
      });

    const args = {
      studentId: student.roleEntity.id,
      phonemeId: phoneme.id,
      triggerAttemptId: triggerAttempt.id,
      failureCount: 5,
      phonemeCharacter: phoneme.character,
    };

    // Both calls race the same check-then-insert with no await between them;
    // the unique(student_id, phoneme_id, status) constraint (migration 029)
    // plus the catch in createAlertIfNeeded should let exactly one through
    // and resolve the other to null, rather than one of them throwing/500ing.
    const results = await Promise.all([alertService.createAlertIfNeeded(args), alertService.createAlertIfNeeded(args)]);

    expect(results.filter((r) => r !== null)).toHaveLength(1);

    const alerts = await db('struggle_alerts').where({ student_id: student.roleEntity.id, phoneme_id: phoneme.id });
    expect(alerts).toHaveLength(1);
  });
});
