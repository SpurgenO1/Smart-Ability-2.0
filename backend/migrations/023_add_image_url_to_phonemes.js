'use strict';

exports.up = function up(knex) {
  return knex.schema.alterTable('phonemes', (table) => {
    table.string('image_url', 500).nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('phonemes', (table) => {
    table.dropColumn('image_url');
  });
};
