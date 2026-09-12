'use strict';

const express = require('express');
const phonemeController = require('../controllers/phoneme.controller');

const router = express.Router();

router.get('/', phonemeController.listPhonemes);
router.get('/:phonemeId', phonemeController.getPhoneme);
router.get('/:phonemeId/articulation-content', phonemeController.getArticulationContent);

module.exports = router;
