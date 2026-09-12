'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('practice_sessions', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.integer('phoneme_id').notNullable().references('id').inTable('phonemes').onDelete('CASCADE');
    table.string('mode', 50).notNullable().defaultTo('self_practice');
    table.enu('status', ['active', 'completed', 'abandoned']).notNullable().defaultTo('active');
    table.timestamp('started_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('practice_sessions');
};
