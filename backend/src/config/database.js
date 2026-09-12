'use strict';

const path = require('path');

let isInMemory = false;

function buildKnex() {
  const env = process.env.NODE_ENV || 'development';
  const connectionString = env === 'test' ? process.env.DATABASE_URL_TEST : process.env.DATABASE_URL;

  // Use pg-mem for test environment or when explicitly requested / DATABASE_URL is not configured
  if (env === 'test' || !connectionString || connectionString === 'memory') {
    isInMemory = true;
    const { newDb } = require('pg-mem');
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_setting',
      args: [],
      returns: 'text',
      implementation: () => null,
    });
    const pgMemAdapter = db.adapters.createKnex(0, {
      client: 'pg',
      useNullAsDefault: true,
    });
    return pgMemAdapter;
  }

  return require('knex')({
    client: 'pg',
    connection: connectionString,
    pool: { min: 2, max: 10 },
    migrations: {
      directory: path.join(__dirname, '..', '..', 'migrations'),
    },
    seeds: {
      directory: path.join(__dirname, '..', '..', 'seeds'),
    },
  });
}

const knex = buildKnex();
knex.isInMemory = isInMemory;

/**
 * Initializes schema and seed data when running with pg-mem in-memory mode.
 */
knex.initDatabase = async function initDatabase() {
  if (!isInMemory) return;
  const migrationsDir = path.join(__dirname, '..', '..', 'migrations');
  const seedsDir = path.join(__dirname, '..', '..', 'seeds');

  // eslint-disable-next-line no-console
  console.log('⚡ Initializing in-memory PostgreSQL schema and seeds...');
  await knex.migrate.latest({ directory: migrationsDir });
  await knex.seed.run({ directory: seedsDir });
  // eslint-disable-next-line no-console
  console.log('✅ In-memory database ready with Hindi phonemes and demo accounts!');
};

module.exports = knex;
