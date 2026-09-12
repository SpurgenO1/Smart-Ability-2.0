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

async function submitAttempt(student, sessionId, { pass, attemptNumber, phonemeCharacter }) {
  const body = pass
    ? {
        attemptNumber,
        recognizedText: phonemeCharacter,
        recognitionConfidence: 0.95,
        audioFeatures: { matchScore: 0.95 },
        mouthFeatures: { matchScore: 0.95 },
      }
    : {
        attemptNumber,
        recognizedText: 'wrong',
        recognitionConfidence: 0.9,
        audioFeatures: { matchScore: 0.9 },
        mouthFeatures: { matchScore: 0.9 },
      };

  return request(app)
    .post(`/api/v1/practice/sessions/${sessionId}/attempts`)
    .set(authHeader(student.accessToken))
    .send(body);
}

describe('progress / mastery thresholds (config-driven, not a clinical claim)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('mastery_status becomes "mastered" only once min attempts and min accuracy are both met', async () => {
    const therapist = await registerAndLogin('therapist');
    const student = await registerAndLogin('student');
    await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);
    const phoneme = await createPhoneme();

    const sessionRes = await request(app)
      .post('/api/v1/practice/sessions')
      .set(authHeader(student.accessToken))
      .send({ studentId: student.roleEntity.id, phonemeId: phoneme.id });
    const sessionId = sessionRes.body.data.sessionId;

    // 9 passes: enough accuracy, not enough attempts yet (min is 10).
    for (let i = 1; i <= 9; i += 1) {
      await submitAttempt(student, sessionId, { pass: true, attemptNumber: i, phonemeCharacter: phoneme.character });
    }

    let progress = await db('progress_records').where({ student_id: student.roleEntity.id, phoneme_id: phoneme.id }).first();
    expect(progress.mastery_status).toBe('in_progress');

    // 10th attempt: now at 10 attempts, 100% accuracy -> mastered.
    await submitAttempt(student, sessionId, { pass: true, attemptNumber: 10, phonemeCharacter: phoneme.character });

    progress = await db('progress_records').where({ student_id: student.roleEntity.id, phoneme_id: phoneme.id }).first();
    expect(progress.mastery_status).toBe('mastered');

    const progressRes = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}/progress`)
      .set(authHeader(student.accessToken));
    expect(progressRes.status).toBe(200);
    expect(progressRes.body.data.progress[0].masteryStatus).toBe('mastered');
  });

  test('low accuracy keeps status at in_progress even past the attempt-count minimum', async () => {
    const student = await registerAndLogin('student');
    const phoneme = await createPhoneme();

    const sessionRes = await request(app)
      .post('/api/v1/practice/sessions')
      .set(authHeader(student.accessToken))
      .send({ studentId: student.roleEntity.id, phonemeId: phoneme.id });
    const sessionId = sessionRes.body.data.sessionId;

    // Alternate pass/fail for 12 attempts -> ~50% accuracy, well under 0.85.
    for (let i = 1; i <= 12; i += 1) {
      await submitAttempt(student, sessionId, {
        pass: i % 2 === 0,
        attemptNumber: i,
        phonemeCharacter: phoneme.character,
      });
    }

    const progress = await db('progress_records')
      .where({ student_id: student.roleEntity.id, phoneme_id: phoneme.id })
      .first();
    expect(progress.mastery_status).toBe('in_progress');
  });
});
