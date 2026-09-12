'use strict';

exports.up = function up(knex) {
  return knex.schema.alterTable('therapy_sessions', (table) => {
    table.timestamp('scheduled_time').nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('therapy_sessions', (table) => {
    table.dropColumn('scheduled_time');
  });
};
