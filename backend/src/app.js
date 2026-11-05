'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');

const FRONTEND_DIR = path.join(__dirname, '..', '..', 'frontend');

const app = express();

// Render terminates HTTPS at a proxy; without this every visitor shares one
// rate-limit bucket keyed on the proxy's IP.
app.set('trust proxy', 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(cors({ origin: process.env.CORS_ORIGIN || process.env.RENDER_EXTERNAL_URL || '*' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static videos and media assets
app.use('/media', express.static(path.join(FRONTEND_DIR, 'assets', 'videos')));

// Serve the frontend application (HTML, CSS, JS, Assets)
app.use(express.static(FRONTEND_DIR));

app.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
