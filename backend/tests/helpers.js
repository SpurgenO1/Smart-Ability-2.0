'use strict';

const request = require('supertest');
const app = require('../src/app');
const { db } = require('./setup');

let userCounter = 0;

async function registerAndLogin(role, overrides = {}) {
  userCounter += 1;
  const email = overrides.email || `${role}${userCounter}@example.com`;
  const password = overrides.password || 'Password123!';
  const name = overrides.name || `${role} ${userCounter}`;

  await request(app).post('/api/v1/auth/register').send({ name, email, password, role });

  const loginRes = await request(app).post('/api/v1/auth/login').send({ email, password });

  const { accessToken, refreshToken, user } = loginRes.body.data;

  let roleEntity = null;
  if (role === 'student') roleEntity = await db('students').where({ user_id: user.id }).first();
  if (role === 'therapist') roleEntity = await db('therapists').where({ user_id: user.id }).first();
  if (role === 'parent') roleEntity = await db('parents').where({ user_id: user.id }).first();

  return { user, accessToken, refreshToken, roleEntity };
}

async function assignTherapistToStudent(therapistId, studentId) {
  return db('therapist_student').insert({ therapist_id: therapistId, student_id: studentId, status: 'active' });
}

async function linkParentToStudent(parentId, studentId, relationship = 'parent') {
  return db('parent_student').insert({ parent_id: parentId, student_id: studentId, relationship, status: 'active' });
}

async function createPhoneme(overrides = {}) {
  const [phoneme] = await db('phonemes')
    .insert({
      character: overrides.character || 'क',
      name: overrides.name || 'ka',
      category: overrides.category || 'velar',
      example_word: overrides.example_word || 'कबूतर',
      example_meaning: overrides.example_meaning || 'pigeon',
      active: true,
    })
    .returning('*');
  return phoneme;
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

module.exports = {
  request,
  app,
  db,
  registerAndLogin,
  assignTherapistToStudent,
  linkParentToStudent,
  createPhoneme,
  authHeader,
};
