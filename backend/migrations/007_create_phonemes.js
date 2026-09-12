'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('phonemes', (table) => {
    table.increments('id').primary();
    table.string('character', 10).notNullable();
    table.string('name', 100).notNullable();
    table.string('category', 100).nullable();
    table.string('example_word', 100).nullable();
    table.string('example_meaning', 255).nullable();
    table.string('normal_audio_url', 500).nullable();
    table.string('slow_audio_url', 500).nullable();
    table.boolean('active').notNullable().defaultTo(true);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('phonemes');
};
