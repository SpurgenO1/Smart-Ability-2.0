'use strict';

const { resetDatabase, db } = require('./setup');
const {
  request,
  app,
  registerAndLogin,
  assignTherapistToStudent,
  linkParentToStudent,
  createPhoneme,
  authHeader,
} = require('./helpers');

describe('reconciled endpoint/payload shapes', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('a client-supplied isSuccess/failureCount cannot override the server-computed result', async () => {
    const student = await registerAndLogin('student');
    const phoneme = await createPhoneme();

    const sessionRes = await request(app)
      .post('/api/v1/practice/sessions')
      .set(authHeader(student.accessToken))
      .send({ studentId: student.roleEntity.id, phonemeId: phoneme.id });

    const res = await request(app)
      .post(`/api/v1/practice/sessions/${sessionRes.body.data.sessionId}/attempts`)
      .set(authHeader(student.accessToken))
      .send({
        attemptNumber: 1,
        recognizedText: 'definitely-wrong',
        recognitionConfidence: 0.9,
        audioFeatures: { matchScore: 0.9 },
        mouthFeatures: { matchScore: 0.9 },
        audioUrl: 'some/uploaded/file.wav',
        isSuccess: true,
        failureCount: 0,
      });

    expect(res.status).toBe(201);
    // Server independently evaluated this as a FAIL despite isSuccess:true.
    expect(res.body.data.result).toBe('fail');
    expect(res.body.data.consecutiveFailures).toBe(1);

    const stored = await db('practice_attempts').where({ session_id: sessionRes.body.data.sessionId }).first();
    expect(stored.audio_url).toBe('some/uploaded/file.wav');
    expect(stored.result).toBe('fail');
  });

  test('GET /students/:id returns age, assigned phonemes, and parent details', async () => {
    const therapist = await registerAndLogin('therapist');
    const parent = await registerAndLogin('parent');
    const student = await registerAndLogin('student');
    await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
    await linkParentToStudent(parent.roleEntity.id, student.roleEntity.id, 'mother');
    await db('students').where({ id: student.roleEntity.id }).update({ date_of_birth: '2018-01-01' });

    const phoneme = await createPhoneme();
    await db('progress_records').insert({
      student_id: student.roleEntity.id,
      phoneme_id: phoneme.id,
      mastery_status: 'in_progress',
    });

    const res = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}`)
      .set(authHeader(therapist.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.age).toBeGreaterThanOrEqual(6);
    expect(res.body.data.assignedPhonemes).toHaveLength(1);
    expect(res.body.data.assignedPhonemes[0].character).toBe(phoneme.character);
    expect(res.body.data.parents).toHaveLength(1);
    expect(res.body.data.parents[0].relationship).toBe('mother');
    expect(res.body.data.parents[0].name).toBe(parent.user.name);
  });

  test('GET /students includes activePhonemes per student and rejects a mismatched ?therapistId', async () => {
    const therapist = await registerAndLogin('therapist');
    const otherTherapist = await registerAndLogin('therapist');
    const student = await registerAndLogin('student');
    await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
    const phoneme = await createPhoneme();
    await db('progress_records').insert({
      student_id: student.roleEntity.id,
      phoneme_id: phoneme.id,
      mastery_status: 'in_progress',
    });

    const res = await request(app).get('/api/v1/students').set(authHeader(therapist.accessToken));
    expect(res.status).toBe(200);
    expect(res.body.data.students[0].activePhonemes).toHaveLength(1);

    const forbidden = await request(app)
      .get(`/api/v1/students?therapistId=${otherTherapist.roleEntity.id}`)
      .set(authHeader(therapist.accessToken));
    expect(forbidden.status).toBe(403);
  });

  test('phonemes support ?category=sparsh filtering and expose imageUrl', async () => {
    const student = await registerAndLogin('student');
    await createPhoneme({ character: 'क', name: 'ka', category: 'sparsh' });
    await createPhoneme({ character: 'श', name: 'sha', category: 'ushma' });

    const res = await request(app).get('/api/v1/phonemes?category=sparsh').set(authHeader(student.accessToken));
    expect(res.status).toBe(200);
    expect(res.body.data.phonemes).toHaveLength(1);
    expect(res.body.data.phonemes[0].character).toBe('क');
  });

  test('unlock without a contentId auto-resolves the phoneme content, and sendNotification:false skips the notification', async () => {
    const therapist = await registerAndLogin('therapist');
    const student = await registerAndLogin('student');
    await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
    const phoneme = await createPhoneme();
    await db('three_d_content').insert({ phoneme_id: phoneme.id, video_url: `content/${phoneme.name}/tutorial.mp4` });

    const sessionRes = await request(app)
      .post('/api/v1/practice/sessions')
      .set(authHeader(student.accessToken))
      .send({ studentId: student.roleEntity.id, phonemeId: phoneme.id });
    for (let i = 1; i <= 5; i += 1) {
      await request(app)
        .post(`/api/v1/practice/sessions/${sessionRes.body.data.sessionId}/attempts`)
        .set(authHeader(student.accessToken))
        .send({
          attemptNumber: i,
          recognizedText: 'wrong',
          recognitionConfidence: 0.9,
          audioFeatures: { matchScore: 0.9 },
          mouthFeatures: { matchScore: 0.9 },
        });
    }

    const alert = (await db('struggle_alerts').where({ student_id: student.roleEntity.id }).first());

    const unlockRes = await request(app)
      .post(`/api/v1/alerts/${alert.id}/unlock`)
      .set(authHeader(therapist.accessToken))
      .send({ sendNotification: false });

    expect(unlockRes.status).toBe(201);

    const notifications = await db('notifications').where({ type: 'content_unlocked' });
    expect(notifications).toHaveLength(0);
  });

  test('session notes accept notes/score/targetPhoneme and push-content accepts a type alias', async () => {
    const therapist = await registerAndLogin('therapist');
    const student = await registerAndLogin('student');
    await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
    const phoneme = await createPhoneme();
    const [content] = await db('three_d_content')
      .insert({ phoneme_id: phoneme.id, video_url: `content/${phoneme.name}/tutorial.mp4` })
      .returning('*');

    const sessionRes = await request(app)
      .post('/api/v1/sessions')
      .set(authHeader(therapist.accessToken))
      .send({ studentId: student.roleEntity.id, scheduledTime: '2026-01-01T10:00:00.000Z' });
    const sessionId = sessionRes.body.data.sessionId;

    const noteRes = await request(app)
      .post(`/api/v1/sessions/${sessionId}/notes`)
      .set(authHeader(therapist.accessToken))
      .send({ notes: 'Great progress today', score: 7.5, targetPhoneme: phoneme.character });
    expect(noteRes.status).toBe(201);
    expect(noteRes.body.data.note).toBe('Great progress today');
    expect(noteRes.body.data.score).toBe(7.5);

    await request(app).post(`/api/v1/sessions/${sessionId}/start`).set(authHeader(therapist.accessToken));

    const pushRes = await request(app)
      .post(`/api/v1/sessions/${sessionId}/push-content`)
      .set(authHeader(therapist.accessToken))
      .send({ contentId: content.id, type: '3D_AIRFLOW' });
    expect(pushRes.status).toBe(200);
    expect(pushRes.body.data.contentType).toBe('3D_AIRFLOW');
    expect(pushRes.body.data.contentUrl).toEqual(expect.any(String));
  });
});
