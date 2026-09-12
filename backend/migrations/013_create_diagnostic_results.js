'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('diagnostic_results', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.string('feature', 100).notNullable();
    table.float('confidence').notNullable();
    table.jsonb('evidence').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('diagnostic_results');
};
