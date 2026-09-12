'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('articulatory_features', (table) => {
    table.increments('id').primary();
    table.string('feature_name', 100).notNullable();
    table.text('description').nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('articulatory_features');
};
