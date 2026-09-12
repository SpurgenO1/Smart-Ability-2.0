'use strict';

const { resetDatabase } = require('./setup');
const {
  request,
  app,
  registerAndLogin,
  assignTherapistToStudent,
  linkParentToStudent,
  authHeader,
} = require('./helpers');

describe('resource-ownership authorization (IDOR protection)', () => {
  beforeEach(async () => {
    await resetDatabase();
  });

  test('a student cannot fetch another student by changing the URL id', async () => {
    const studentA = await registerAndLogin('student');
    const studentB = await registerAndLogin('student');

    const res = await request(app)
      .get(`/api/v1/students/${studentB.roleEntity.id}`)
      .set(authHeader(studentA.accessToken));

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_RESOURCE');
  });

  test('a student can fetch their own profile', async () => {
    const student = await registerAndLogin('student');

    const res = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}`)
      .set(authHeader(student.accessToken));

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(student.roleEntity.id);
  });

  test('a therapist without an assignment cannot view the student', async () => {
    const therapist = await registerAndLogin('therapist');
    const student = await registerAndLogin('student');

    const res = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}`)
      .set(authHeader(therapist.accessToken));

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_RESOURCE');
  });

  test('an assigned therapist can view the student', async () => {
    const therapist = await registerAndLogin('therapist');
    const student = await registerAndLogin('student');
    await assignTherapistToStudent(therapist.roleEntity.id, student.roleEntity.id);

    const res = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}`)
      .set(authHeader(therapist.accessToken));

    expect(res.status).toBe(200);
  });

  test('a parent not linked to the child is forbidden', async () => {
    const parent = await registerAndLogin('parent');
    const student = await registerAndLogin('student');

    const res = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}`)
      .set(authHeader(parent.accessToken));

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN_RESOURCE');
  });

  test('a linked parent can view the child and see them in /parents/me/children', async () => {
    const parent = await registerAndLogin('parent');
    const student = await registerAndLogin('student');
    await linkParentToStudent(parent.roleEntity.id, student.roleEntity.id);

    const profileRes = await request(app)
      .get(`/api/v1/students/${student.roleEntity.id}`)
      .set(authHeader(parent.accessToken));
    expect(profileRes.status).toBe(200);

    const childrenRes = await request(app)
      .get('/api/v1/parents/me/children')
      .set(authHeader(parent.accessToken));
    expect(childrenRes.status).toBe(200);
    expect(childrenRes.body.data.children).toHaveLength(1);
    expect(childrenRes.body.data.children[0].id).toBe(student.roleEntity.id);
  });

  test('a non-therapist cannot list /students', async () => {
    const student = await registerAndLogin('student');
    const res = await request(app).get('/api/v1/students').set(authHeader(student.accessToken));
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('INVALID_ROLE');
  });
});
