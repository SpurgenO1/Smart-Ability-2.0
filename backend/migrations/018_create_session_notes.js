'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('session_notes', (table) => {
    table.increments('id').primary();
    table.integer('session_id').notNullable().references('id').inTable('therapy_sessions').onDelete('CASCADE');
    table.integer('therapist_id').notNullable().references('id').inTable('therapists').onDelete('CASCADE');
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.text('note').notNullable();
    table.text('recommendation').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('session_notes');
};
