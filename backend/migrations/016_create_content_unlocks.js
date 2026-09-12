'use strict';

exports.up = function up(knex) {
  return knex.schema.createTable('content_unlocks', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.integer('therapist_id').notNullable().references('id').inTable('therapists').onDelete('CASCADE');
    table.integer('phoneme_id').notNullable().references('id').inTable('phonemes').onDelete('CASCADE');
    table.integer('content_id').notNullable().references('id').inTable('three_d_content').onDelete('CASCADE');
    table.integer('alert_id').nullable().references('id').inTable('struggle_alerts').onDelete('SET NULL');
    table.enu('status', ['active', 'expired', 'revoked']).notNullable().defaultTo('active');
    table.timestamp('unlocked_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('expires_at').nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('content_unlocks');
};
