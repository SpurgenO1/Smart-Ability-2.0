'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('progress_records', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.integer('phoneme_id').notNullable().references('id').inTable('phonemes').onDelete('CASCADE');
    table
      .enu('mastery_status', ['not_started', 'in_progress', 'mastered'])
      .notNullable()
      .defaultTo('not_started');
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());

    table.unique(['student_id', 'phoneme_id']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('progress_records');
};
