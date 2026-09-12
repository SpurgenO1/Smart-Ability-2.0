'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('phoneme_features', (table) => {
    table.increments('id').primary();
    table.integer('phoneme_id').notNullable().references('id').inTable('phonemes').onDelete('CASCADE');
    table.integer('feature_id').notNullable().references('id').inTable('articulatory_features').onDelete('CASCADE');
    table.unique(['phoneme_id', 'feature_id']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('phoneme_features');
};
