'use strict';

// Optional pointer to an already-uploaded recording (via the /audio
// upload-url + complete flow). Purely informational - it is never used to
// determine PASS/FAIL, which is always computed server-side from
// recognizedText/recognitionConfidence/audioFeatures/mouthFeatures.
exports.up = function up(knex) {
  return knex.schema.alterTable('practice_attempts', (table) => {
    table.string('audio_url', 500).nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('practice_attempts', (table) => {
    table.dropColumn('audio_url');
  });
};
