'use strict';

const express = require('express');
const diagnosticController = require('../controllers/diagnostic.controller');
const { requireStudentAccess } = require('../middleware/ownership.middleware');

const router = express.Router();

router.get('/:studentId', requireStudentAccess('studentId'), diagnosticController.getDiagnostics);

module.exports = router;
