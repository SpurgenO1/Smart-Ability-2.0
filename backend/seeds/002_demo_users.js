'use strict';

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

exports.seed = async function seed(knex) {
  // Clear existing demo links and entities
  await knex('parent_student').del();
  await knex('therapist_student').del();
  await knex('struggle_alerts').del();
  await knex('practice_attempts').del();
  await knex('practice_sessions').del();
  await knex('parents').del();
  await knex('therapists').del();
  await knex('students').del();
  await knex('users').del();

  const therapistPass = await bcrypt.hash('clinicianpassword', SALT_ROUNDS);
  const studentPass = await bcrypt.hash('studentpassword', SALT_ROUNDS);
  const parentPass = await bcrypt.hash('parentpassword', SALT_ROUNDS);

  // 1. Insert Users
  const [therapistUser] = await knex('users').insert({
    name: 'Dr. Ritu Nair',
    email: 'dr.ritu@speechclinic.org',
    password_hash: therapistPass,
    role: 'therapist',
    status: 'active',
  }).returning('*');

  const [studentUser1] = await knex('users').insert({
    name: 'Aarav Sharma',
    email: 'aarav@speech.edu',
    password_hash: studentPass,
    role: 'student',
    status: 'active',
  }).returning('*');

  const [studentUser2] = await knex('users').insert({
    name: 'Kabir Mehta',
    email: 'kabir@speech.edu',
    password_hash: studentPass,
    role: 'student',
    status: 'active',
  }).returning('*');

  const [parentUser] = await knex('users').insert({
    name: 'Pooja Sharma',
    email: 'sharma.family@email.com',
    password_hash: parentPass,
    role: 'parent',
    status: 'active',
  }).returning('*');

  // 2. Insert Role entities
  const [therapist] = await knex('therapists').insert({
    user_id: therapistUser.id,
    license_number: 'SLP-IND-8849',
    specialization: 'Pediatric Articulation & Phonology',
  }).returning('*');

  const [student1] = await knex('students').insert({
    user_id: studentUser1.id,
    display_name: 'Aarav Sharma',
    date_of_birth: '2020-05-14',
    profile_status: 'active',
  }).returning('*');

  const [student2] = await knex('students').insert({
    user_id: studentUser2.id,
    display_name: 'Kabir Mehta',
    date_of_birth: '2020-08-20',
    profile_status: 'active',
  }).returning('*');

  const [parent] = await knex('parents').insert({
    user_id: parentUser.id,
    phone: '+91 98765 43210',
  }).returning('*');

  // 3. Link Therapist to Students
  await knex('therapist_student').insert([
    { therapist_id: therapist.id, student_id: student1.id, status: 'active' },
    { therapist_id: therapist.id, student_id: student2.id, status: 'active' },
  ]);

  // 4. Link Parent to Students
  await knex('parent_student').insert([
    { parent_id: parent.id, student_id: student1.id, relationship: 'Mother', status: 'active' },
    { parent_id: parent.id, student_id: student2.id, relationship: 'Mother', status: 'active' },
  ]);

  // 5. Query ka phoneme for initial practice session & alert
  const kaPhoneme = await knex('phonemes').where({ name: 'ka' }).first();
  if (kaPhoneme) {
    const [session] = await knex('practice_sessions').insert({
      student_id: student1.id,
      phoneme_id: kaPhoneme.id,
      mode: 'self_practice',
      status: 'active',
    }).returning('*');

    // Seed 5 consecutive failed attempts to demonstrate the 5-failure threshold
    let lastAttemptId = 1;
    for (let i = 1; i <= 5; i++) {
      const inserted = await knex('practice_attempts').insert({
        session_id: session.id,
        student_id: student1.id,
        phoneme_id: kaPhoneme.id,
        attempt_number: i,
        recognized_text: 'ta',
        recognition_confidence: 0.55,
        result: 'fail',
        consecutive_failure_count: i,
        created_at: new Date(Date.now() - (6 - i) * 60000),
      }).returning('*');
      if (inserted && inserted[0]) {
        lastAttemptId = inserted[0].id;
      }
    }

    // Seed struggle alert
    await knex('struggle_alerts').insert({
      student_id: student1.id,
      therapist_id: therapist.id,
      phoneme_id: kaPhoneme.id,
      trigger_attempt_id: lastAttemptId,
      failure_count: 5,
      status: 'pending',
      created_at: knex.fn.now(),
    });
  }
};
