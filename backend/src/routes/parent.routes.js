'use strict';

const express = require('express');
const parentController = require('../controllers/parent.controller');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.use(requireRole('parent'));

router.get('/me/children', parentController.getMyChildren);

module.exports = router;
