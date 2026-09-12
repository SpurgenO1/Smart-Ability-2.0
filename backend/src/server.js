'use strict';

const http = require('http');
const app = require('./app');
const db = require('./config/database');
const { initSocket } = require('./websocket/socket');

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);
initSocket(server);

async function startServer() {
  if (db.initDatabase) {
    await db.initDatabase();
  }

  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`EchoSeed backend listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start EchoSeed server:', err);
  process.exit(1);
});

module.exports = server;
