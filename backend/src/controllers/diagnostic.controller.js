'use strict';

const diagnosticService = require('../services/diagnostic.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const getDiagnostics = asyncHandler(async (req, res) => {
  const result = await diagnosticService.getSuspectedFeatures(req.student.id);
  return success(res, result);
});

module.exports = { getDiagnostics };
