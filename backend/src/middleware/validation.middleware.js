'use strict';

const { error } = require('../utils/apiResponse');

function validateBody(schema) {
  return function validate(req, res, next) {
    const { error: validationError, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (validationError) {
      return error(
        res,
        422,
        'INVALID_REQUEST',
        'Request body failed validation',
        validationError.details.map((d) => d.message)
      );
    }
    req.body = value;
    next();
  };
}

function validateQuery(schema) {
  return function validate(req, res, next) {
    const { error: validationError, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (validationError) {
      return error(
        res,
        422,
        'INVALID_REQUEST',
        'Query parameters failed validation',
        validationError.details.map((d) => d.message)
      );
    }
    req.query = value;
    next();
  };
}

module.exports = { validateBody, validateQuery };
