'use strict';

const { error } = require('../utils/apiResponse');

function requireRole(...roles) {
  return function roleCheck(req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      return error(res, 403, 'INVALID_ROLE', `This action requires role: ${roles.join(' or ')}`);
    }
    next();
  };
}

module.exports = { requireRole };
