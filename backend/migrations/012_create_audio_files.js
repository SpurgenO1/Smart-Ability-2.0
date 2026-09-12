'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('audio_files', (table) => {
    table.increments('id').primary();
    table.string('file_id', 100).notNullable().unique();
    table.string('format', 20).nullable();
    table.integer('duration_ms').nullable();
    table.integer('sample_rate').nullable();
    table.integer('channels').nullable();
    table.integer('size_bytes').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('audio_files');
};
