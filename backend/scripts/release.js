'use strict';

/**
 * Runs before each deploy: applies migrations, then seeds only empty tables.
 * The seed files delete existing rows first, so they must never run against a
 * database that already holds data.
 */
require('dotenv').config();

const config = require('../knexfile')[process.env.NODE_ENV || 'development'];
const knex = require('knex')(config);

async function isEmpty(table) {
  const row = await knex(table).first();
  return !row;
}

async function release() {
  const [, migrations] = await knex.migrate.latest();
  // eslint-disable-next-line no-console
  console.log(`Migrations applied: ${migrations.length}`);

  if (await isEmpty('phonemes')) {
    await knex.seed.run({ specific: '001_phonemes.js' });
    // eslint-disable-next-line no-console
    console.log('Seeded phonemes');
  }

  if (process.env.SEED_DEMO_DATA === 'true' && (await isEmpty('users'))) {
    await knex.seed.run({ specific: '002_demo_users.js' });
    // eslint-disable-next-line no-console
    console.log('Seeded demo accounts');
  }
}

release()
  .then(() => knex.destroy())
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error('Release failed:', err);
    await knex.destroy();
    process.exit(1);
  });
