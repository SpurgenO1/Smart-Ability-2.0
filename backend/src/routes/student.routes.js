'use strict';

const express = require('express');
const studentController = require('../controllers/student.controller');
const progressController = require('../controllers/progress.controller');
const { requireRole } = require('../middleware/role.middleware');
const { requireStudentAccess } = require('../middleware/ownership.middleware');

const router = express.Router();

router.get('/', requireRole('therapist'), studentController.listStudents);
router.get('/:studentId', requireStudentAccess('studentId'), studentController.getStudent);
router.get('/:studentId/progress', requireStudentAccess('studentId'), progressController.getStudentProgress);
router.get(
  '/:studentId/practice-frequency',
  requireStudentAccess('studentId'),
  progressController.getPracticeFrequency
);
router.get(
  '/:studentId/demonstrations',
  requireStudentAccess('studentId'),
  studentController.getStudentDemonstrations
);

module.exports = router;
