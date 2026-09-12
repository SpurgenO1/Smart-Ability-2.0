'use strict';

// `category` now holds the traditional Hindi grammar classification
// (sparsh / antahstha / ushma) so ?category=sparsh works as documented.
// The finer phonetic place of articulation (velar, retroflex, ...) that
// `category` used to hold moves here.
exports.up = function up(knex) {
  return knex.schema.alterTable('phonemes', (table) => {
    table.string('place_of_articulation', 100).nullable();
  });
};

exports.down = function down(knex) {
  return knex.schema.alterTable('phonemes', (table) => {
    table.dropColumn('place_of_articulation');
  });
};
