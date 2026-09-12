'use strict';

require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler.middleware');

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static videos and media assets
app.use('/media', express.static(path.join(__dirname, '..', '..', 'assets', 'videos')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve root frontend application (HTML, CSS, JS, Assets)
app.use(express.static(path.join(__dirname, '..', '..')));

app.get('/health', (req, res) => res.json({ success: true, data: { status: 'ok' } }));

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
