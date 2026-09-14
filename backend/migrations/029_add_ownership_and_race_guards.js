'use strict';

exports.up = async function up(knex) {
  await knex.schema.alterTable('audio_files', (table) => {
    // Nullable: rows created before this migration have no known owner.
    table.integer('student_id').nullable().references('id').inTable('students').onDelete('CASCADE');
  });

  await knex.schema.alterTable('struggle_alerts', (table) => {
    // Backs the check-then-insert in alert.service.js#createAlertIfNeeded:
    // without this, two concurrent requests hitting the 5th consecutive
    // failure for the same student+phoneme can both pass the "is there
    // already a pending alert" check before either insert commits, producing
    // duplicate alerts and duplicate parent/therapist notifications.
    table.unique(['student_id', 'phoneme_id', 'status'], 'struggle_alerts_student_phoneme_status_unique');
  });

  // therapist_student/parent_student only index (therapist_id|parent_id,
  // student_id) via their existing unique() composite, which doesn't serve a
  // `WHERE student_id = ?` lookup. That direction is queried on every
  // practice attempt (broadcastProgressUpdated) and every struggle alert
  // (notifyParents), so it's worth a dedicated index rather than a scan.
  await knex.schema.alterTable('therapist_student', (table) => {
    table.index(['student_id'], 'therapist_student_student_id_index');
  });
  await knex.schema.alterTable('parent_student', (table) => {
    table.index(['student_id'], 'parent_student_student_id_index');
  });
};

exports.down = async function down(knex) {
  await knex.schema.alterTable('parent_student', (table) => {
    table.dropIndex(['student_id'], 'parent_student_student_id_index');
  });
  await knex.schema.alterTable('therapist_student', (table) => {
    table.dropIndex(['student_id'], 'therapist_student_student_id_index');
  });
  await knex.schema.alterTable('struggle_alerts', (table) => {
    table.dropUnique(['student_id', 'phoneme_id', 'status'], 'struggle_alerts_student_phoneme_status_unique');
  });
  await knex.schema.alterTable('audio_files', (table) => {
    table.dropColumn('student_id');
  });
};
