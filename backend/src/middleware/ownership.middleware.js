'use strict';

const studentModel = require('../models/student.model');
const therapistStudentModel = require('../models/therapistStudent.model');
const parentStudentModel = require('../models/parentStudent.model');
const { error } = require('../utils/apiResponse');

/**
 * Enforces that the authenticated actor may access the student named by
 * `req.params[paramName]`. This is the guard against IDOR: a student
 * flipping an ID in the URL must never reach another student's data, and
 * a therapist/parent must have an explicit active assignment/link row -
 * the JWT role alone is never sufficient.
 */
function requireStudentAccess(paramName = 'studentId') {
  return async function ownershipCheck(req, res, next) {
    const studentId = Number(req.params[paramName]);
    if (!Number.isInteger(studentId)) {
      return error(res, 400, 'INVALID_REQUEST', `Invalid ${paramName}`);
    }

    const student = await studentModel.findById(studentId);
    if (!student) {
      return error(res, 404, 'STUDENT_NOT_FOUND', 'Student not found');
    }

    const { user, roleEntity } = req;

    if (user.role === 'student') {
      if (!roleEntity || roleEntity.id !== studentId) {
        return error(res, 403, 'FORBIDDEN_RESOURCE', 'You may only access your own data');
      }
    } else if (user.role === 'therapist') {
      const assignment = roleEntity && (await therapistStudentModel.isAssigned(roleEntity.id, studentId));
      if (!assignment) {
        return error(res, 403, 'FORBIDDEN_RESOURCE', 'You are not assigned to this student');
      }
    } else if (user.role === 'parent') {
      const link = roleEntity && (await parentStudentModel.isLinked(roleEntity.id, studentId));
      if (!link) {
        return error(res, 403, 'FORBIDDEN_RESOURCE', 'You are not linked to this student');
      }
    } else {
      return error(res, 403, 'FORBIDDEN_RESOURCE', 'Unknown role');
    }

    req.student = student;
    next();
  };
}

module.exports = { requireStudentAccess };
