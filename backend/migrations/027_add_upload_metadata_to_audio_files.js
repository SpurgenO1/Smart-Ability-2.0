'use strict';

exports.up = function up(knex) {
  return knex.schema.alterTable('audio_files', (table) => {
    table.string('original_filename', 255).nullable();
    table.string('upload_path', 500).nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('audio_files', (table) => {
    table.dropColumn('original_filename');
    table.dropColumn('upload_path');
  });
};
