'use strict';

exports.up = function up(knex) {
  return knex.schema.alterTable('session_notes', (table) => {
    table.float('score').nullable();
    table.integer('target_phoneme_id').nullable().references('id').inTable('phonemes').onDelete('SET NULL');
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('session_notes', (table) => {
    table.dropColumn('score');
    table.dropColumn('target_phoneme_id');
  });
};
