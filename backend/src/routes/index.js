'use strict';

const express = require('express');

const authRoutes = require('./auth.routes');
const studentRoutes = require('./student.routes');
const phonemeRoutes = require('./phoneme.routes');
const practiceRoutes = require('./practice.routes');
const alertRoutes = require('./alert.routes');
const sessionRoutes = require('./session.routes');
const parentRoutes = require('./parent.routes');
const diagnosticRoutes = require('./diagnostic.routes');
const audioRoutes = require('./audio.routes');

const { authenticate } = require('../middleware/auth.middleware');
const { apiLimiter } = require('../middleware/rateLimit.middleware');

const router = express.Router();

// Public: register/login (login has its own stricter limiter) and refresh.
router.use('/auth', authRoutes);

// Audio has its own auth story per-route: upload-url/complete require a
// Bearer token, but the raw signed-URL PUT is authorized by its HMAC
// signature (like a presigned S3 URL), not a JWT - so it must not sit
// behind the blanket `authenticate` below.
router.use('/audio', audioRoutes);

// Everything else requires a valid access token; the general API rate
// limit (100 req/min) is keyed per-user, which only works once req.user
// is populated - hence authenticate runs first.
router.use(authenticate);
router.use(apiLimiter);

router.use('/students', studentRoutes);
router.use('/phonemes', phonemeRoutes);
router.use('/practice', practiceRoutes);
router.use('/alerts', alertRoutes);
router.use('/sessions', sessionRoutes);
router.use('/parents', parentRoutes);
router.use('/diagnostics', diagnosticRoutes);

module.exports = router;
