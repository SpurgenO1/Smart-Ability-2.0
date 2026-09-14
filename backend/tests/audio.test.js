'use strict';

const { resetDatabase, db } = require('./setup');
const { request, app, registerAndLogin, authHeader } = require('./helpers');

async function uploadAudio(student, bytes = 'fake-audio-bytes') {
  const urlRes = await request(app)
    .post('/api/v1/audio/upload-url')
    .set(authHeader(student.accessToken))
    .send({ format: 'wav' });
  const { uploadUrl, fileId } = urlRes.body.data;

  await request(app)
    .put(uploadUrl)
    .set('Content-Type', 'application/octet-stream')
    .send(Buffer.from(bytes));

  return { fileId, uploadUrl };
}

describe('audio upload (2-step signed URL flow)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('upload-url -> raw PUT -> complete attaches the recording', async () => {
    const student = await registerAndLogin('student');

    const urlRes = await request(app)
      .post('/api/v1/audio/upload-url')
      .set(authHeader(student.accessToken))
      .send({ format: 'wav', durationMs: 1200, sampleRate: 16000, channels: 1 });

    expect(urlRes.status).toBe(201);
    const { uploadUrl, fileId, expiresIn } = urlRes.body.data;
    expect(fileId).toEqual(expect.any(String));
    expect(expiresIn).toBeGreaterThan(0);

    const putRes = await request(app)
      .put(uploadUrl)
      .set('Content-Type', 'application/octet-stream')
      .send(Buffer.from('fake-audio-bytes'));

    expect(putRes.status).toBe(200);
    expect(putRes.body.data.sizeBytes).toBe(Buffer.from('fake-audio-bytes').length);

    const audioRow = await db('audio_files').where({ file_id: fileId }).first();
    expect(audioRow.size_bytes).toBe(Buffer.from('fake-audio-bytes').length);

    const completeRes = await request(app)
      .post('/api/v1/audio/complete')
      .set(authHeader(student.accessToken))
      .send({ fileId });

    expect(completeRes.status).toBe(200);
    expect(completeRes.body.data.status).toBe('attached');
  });

  test('a raw upload with a tampered signature is rejected', async () => {
    const student = await registerAndLogin('student');

    const urlRes = await request(app)
      .post('/api/v1/audio/upload-url')
      .set(authHeader(student.accessToken))
      .send({});

    const { fileId } = urlRes.body.data;

    const res = await request(app)
      .put(`/api/v1/audio/raw/${fileId}?expires=9999999999999&sig=deadbeef`)
      .send(Buffer.from('x'));

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('FILE_UPLOAD_FAILED');
  });

  test('the signed GET playback URL returns the uploaded bytes', async () => {
    const student = await registerAndLogin('student');
    const { fileId, uploadUrl } = await uploadAudio(student, 'playable-bytes');

    const downloadRes = await request(app).get(uploadUrl);

    expect(downloadRes.status).toBe(200);
    expect(downloadRes.body).toEqual(Buffer.from('playable-bytes'));
  });

  test('a non-student cannot request an audio upload URL', async () => {
    const therapist = await registerAndLogin('therapist');

    const res = await request(app)
      .post('/api/v1/audio/upload-url')
      .set(authHeader(therapist.accessToken))
      .send({ format: 'wav' });

    expect(res.status).toBe(403);
  });

  test('a student cannot complete another student\'s audio upload', async () => {
    const owner = await registerAndLogin('student');
    const intruder = await registerAndLogin('student');
    const { fileId } = await uploadAudio(owner);

    const res = await request(app)
      .post('/api/v1/audio/complete')
      .set(authHeader(intruder.accessToken))
      .send({ fileId });

    expect(res.status).toBe(403);

    const audioRow = await db('audio_files').where({ file_id: fileId }).first();
    expect(audioRow.student_id).toBe(owner.roleEntity.id);
  });
});
