'use strict';

// Live/synchronous therapist-led sessions (distinct from self-directed
// practice_sessions).
exports.up = function up(knex) {
  return knex.schema.createTable('therapy_sessions', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.integer('therapist_id').notNullable().references('id').inTable('therapists').onDelete('CASCADE');
    table.string('type', 50).notNullable().defaultTo('live');
    table.enu('status', ['scheduled', 'active', 'completed', 'cancelled']).notNullable().defaultTo('scheduled');
    table.timestamp('started_at').nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('therapy_sessions');
};
