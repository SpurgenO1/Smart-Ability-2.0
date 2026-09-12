'use strict';

// Assignment table - the authorization source of truth for therapist access
// to a student's data. Ownership middleware checks this, never just the JWT role.
exports.up = function up(knex) {
  return knex.schema.createTable('therapist_student', (table) => {
    table.increments('id').primary();
    table.integer('therapist_id').notNullable().references('id').inTable('therapists').onDelete('CASCADE');
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.timestamp('assigned_at').notNullable().defaultTo(knex.fn.now());
    table.enu('status', ['active', 'inactive']).notNullable().defaultTo('active');
    table.unique(['therapist_id', 'student_id']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('therapist_student');
};
