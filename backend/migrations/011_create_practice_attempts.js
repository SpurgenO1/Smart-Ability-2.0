'use strict';

// consecutive_failure_count is always computed server-side (see
// evaluation.service.js) and stored as a snapshot for audit/history -
// it is never accepted from the client.
exports.up = function up(knex) {
  return knex.schema.createTable('practice_attempts', (table) => {
    table.increments('id').primary();
    table.integer('session_id').notNullable().references('id').inTable('practice_sessions').onDelete('CASCADE');
    table.integer('student_id').notNullable().references('id').inTable('students').onDelete('CASCADE');
    table.integer('phoneme_id').notNullable().references('id').inTable('phonemes').onDelete('CASCADE');
    table.integer('attempt_number').notNullable();
    table.text('recognized_text').nullable();
    table.float('recognition_confidence').nullable();
    table.enu('result', ['pass', 'fail']).notNullable();
    table.integer('consecutive_failure_count').notNullable().defaultTo(0);
    table.jsonb('audio_feature_json').nullable();
    table.jsonb('mouth_feature_json').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.index(['student_id', 'phoneme_id', 'created_at']);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTableIfExists('practice_attempts');
};
