'use strict';

// Identity-adjacent data for a student (display_name, dob) lives here,
// separated from clinical/practice data which references students.id only.
exports.up = function up(knex) {
  return knex.schema.createTable('students', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('display_name', 255).notNullable();
    table.date('date_of_birth').nullable();
    table.enu('profile_status', ['active', 'inactive', 'archived']).notNullable().defaultTo('active');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('students');
};
