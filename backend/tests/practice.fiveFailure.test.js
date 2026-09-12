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

async function setupStudentWithSession() {
  const therapist = await registerAndLogin('therapist');
  const student = await registerAndLogin('student');
  await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
  const phoneme = await createPhoneme();

  const sessionRes = await request(app)
    .post('/api/v1/practice/sessions')
    .set(authHeader(student.accessToken))
    .send({ studentId: student.roleEntity.id, phonemeId: phoneme.id, mode: 'self_practice' });

  const sessionId = sessionRes.body.data.sessionId;

  return { therapist, student, phoneme, sessionId };
}

function failAttempt(attemptNumber) {
  return {
    attemptNumber,
    targetPhoneme: undefined,
    recognizedText: 'not-the-right-sound',
    recognitionConfidence: 0.9,
    audioFeatures: { matchScore: 0.9 },
    mouthFeatures: { matchScore: 0.9 },
  };
}

function passAttempt(attemptNumber, phonemeCharacter) {
  return {
    attemptNumber,
    targetPhoneme: phonemeCharacter,
    recognizedText: phonemeCharacter,
    recognitionConfidence: 0.95,
    audioFeatures: { matchScore: 0.95 },
    mouthFeatures: { matchScore: 0.95 },
  };
}

async function submitAttempt(student, sessionId, body) {
  return request(app)
    .post(`/api/v1/practice/sessions/${sessionId}/attempts`)
    .set(authHeader(student.accessToken))
    .send(body);
}

describe('five-consecutive-failure rule (server-recomputed, never client-trusted)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('FAIL,FAIL,FAIL,FAIL,FAIL -> alert created on the 5th attempt', async () => {
    const { student, phoneme, therapist, sessionId } = await setupStudentWithSession();

    let lastResponse;
    for (let i = 1; i <= 5; i += 1) {
      lastResponse = await submitAttempt(student, sessionId, failAttempt(i));
      expect(lastResponse.status).toBe(201);
      expect(lastResponse.body.data.result).toBe('fail');
      expect(lastResponse.body.data.consecutiveFailures).toBe(i);
    }

    expect(lastResponse.body.data.therapistAlertTriggered).toBe(true);

    const alerts = await db('struggle_alerts').where({ student_id: student.roleEntity.id, phoneme_id: phoneme.id });
    expect(alerts).toHaveLength(1);
    expect(alerts[0].status).toBe('pending');
    expect(alerts[0].failure_count).toBe(5);
    expect(alerts[0].therapist_id).toBe(therapist.roleEntity.id);
  });

  test('FAIL,FAIL,PASS,FAIL,FAIL,FAIL,FAIL,FAIL -> alert created (counter reset by the PASS)', async () => {
    const { student, phoneme, sessionId } = await setupStudentWithSession();

    const sequence = ['fail', 'fail', 'pass', 'fail', 'fail', 'fail', 'fail', 'fail'];
    const responses = [];
    for (let i = 0; i < sequence.length; i += 1) {
      const attemptNumber = i + 1;
      const body =
        sequence[i] === 'pass' ? passAttempt(attemptNumber, phoneme.character) : failAttempt(attemptNumber);
      const res = await submitAttempt(student, sessionId, body);
      expect(res.status).toBe(201);
      responses.push(res.body.data);
    }

    // pass at index 2 resets the streak; the run of 5 fails after it is
    // indices 3..7, so consecutiveFailures should read 1,2,3,4,5.
    expect(responses.map((r) => r.consecutiveFailures)).toEqual([1, 2, 0, 1, 2, 3, 4, 5]);
    expect(responses.map((r) => r.result)).toEqual(['fail', 'fail', 'pass', 'fail', 'fail', 'fail', 'fail', 'fail']);

    expect(responses[7].therapistAlertTriggered).toBe(true);
    expect(responses.slice(0, 7).every((r) => r.therapistAlertTriggered === false)).toBe(true);

    const alerts = await db('struggle_alerts').where({ student_id: student.roleEntity.id, phoneme_id: phoneme.id });
    expect(alerts).toHaveLength(1);
    expect(alerts[0].failure_count).toBe(5);
  });

  test('FAIL,FAIL,PASS -> no alert (counter never reached 5)', async () => {
    const { student, phoneme, sessionId } = await setupStudentWithSession();

    const r1 = await submitAttempt(student, sessionId, failAttempt(1));
    const r2 = await submitAttempt(student, sessionId, failAttempt(2));
    const r3 = await submitAttempt(student, sessionId, passAttempt(3, phoneme.character));

    expect(r1.body.data.consecutiveFailures).toBe(1);
    expect(r2.body.data.consecutiveFailures).toBe(2);
    expect(r3.body.data.consecutiveFailures).toBe(0);
    expect(r3.body.data.result).toBe('pass');

    expect([r1, r2, r3].every((r) => r.body.data.therapistAlertTriggered === false)).toBe(true);

    const alerts = await db('struggle_alerts').where({ student_id: student.roleEntity.id, phoneme_id: phoneme.id });
    expect(alerts).toHaveLength(0);
  });

  test('a client-supplied failure count is ignored - server recomputes from history', async () => {
    const { student, sessionId } = await setupStudentWithSession();

    const maliciousBody = { ...failAttempt(1), consecutiveFailures: 999, failureCount: 999 };
    const res = await submitAttempt(student, sessionId, maliciousBody);

    expect(res.status).toBe(201);
    expect(res.body.data.consecutiveFailures).toBe(1);
    expect(res.body.data.therapistAlertTriggered).toBe(false);
  });
});
