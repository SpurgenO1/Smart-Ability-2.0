'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('three_d_content', (table) => {
    table.increments('id').primary();
    table.integer('phoneme_id').notNullable().references('id').inTable('phonemes').onDelete('CASCADE');
    table.string('model_url', 500).nullable();
    table.string('animation_url', 500).nullable();
    table.string('video_url', 500).nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('three_d_content');
};
