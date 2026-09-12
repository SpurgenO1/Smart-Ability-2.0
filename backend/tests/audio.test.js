'use strict';

const { resetDatabase, db } = require('./setup');
const { request, app, registerAndLogin, authHeader } = require('./helpers');

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
});
