'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('practice_daily_stats', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.date('date').notNullable();
    table.integer('sessions').notNullable().defaultTo(0);
    table.integer('attempts').notNullable().defaultTo(0);

    table.unique(['student_id', 'date']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('practice_daily_stats');
};
