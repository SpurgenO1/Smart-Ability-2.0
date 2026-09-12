'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('id').primary();
    table.integer('recipient_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('type', 100).notNullable();
    table.string('title', 255).notNullable();
    table.text('message').nullable();
    table.string('reference_type', 100).nullable();
    table.integer('reference_id').nullable();
    table.timestamp('read_at').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index(['recipient_id', 'read_at']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('notifications');
};
