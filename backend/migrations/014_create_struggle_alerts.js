'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('struggle_alerts', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.integer('therapist_id').notNullable().references('id').inTable('therapists').onDelete('CASCADE');
    table.integer('phoneme_id').notNullable().references('id').inTable('phonemes').onDelete('CASCADE');
    table.integer('trigger_attempt_id').notNullable().references('id').inTable('practice_attempts').onDelete('CASCADE');
    table.integer('failure_count').notNullable();
    table
      .enu('status', ['pending', 'reviewed', 'unlocked', 'resolved', 'dismissed'])
      .notNullable()
      .defaultTo('pending');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('resolved_at').nullable();

    table.index(['student_id', 'phoneme_id', 'status']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('struggle_alerts');
};
