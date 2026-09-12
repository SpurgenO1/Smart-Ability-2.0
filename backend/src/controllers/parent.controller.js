'use strict';

const parentStudentModel = require('../models/parentStudent.model');
const studentModel = require('../models/student.model');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const getMyChildren = asyncHandler(async (req, res) => {
  const studentIds = await parentStudentModel.listStudentIdsForParent(req.roleEntity.id);
  const students = await studentModel.listByIds(studentIds);

  return success(res, {
    children: students.map((s) => ({
      id: s.id,
      displayName: s.display_name,
      dateOfBirth: s.date_of_birth,
      profileStatus: s.profile_status,
    })),
  });
});

module.exports = { getMyChildren };
