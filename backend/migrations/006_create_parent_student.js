'use strict';

// Authorization source of truth for parent access to a child's data.
exports.up = function up(knex) {
  return knex.schema.createTable('parent_student', (table) => {
    table.increments('id').primary();
    table.integer('parent_id').notNullable().references('id').inTable('parents').onDelete('CASCADE');
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.string('relationship', 50).nullable();
    table.enu('status', ['active', 'inactive']).notNullable().defaultTo('active');
    table.unique(['parent_id', 'student_id']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('parent_student');
};
