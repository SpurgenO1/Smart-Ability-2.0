'use strict';

const { ApiError } = require('../utils/errors');
const { error } = require('../utils/apiResponse');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return error(res, err.status, err.code, err.message, err.details);
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return error(res, 500, 'INTERNAL_SERVER_ERROR', 'Something went wrong');
}

function notFoundHandler(req, res) {
  return error(res, 404, 'INVALID_REQUEST', `No route for ${req.method} ${req.originalUrl}`);
}

module.exports = { errorHandler, notFoundHandler };
