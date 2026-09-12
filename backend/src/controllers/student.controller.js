'use strict';

const db = require('../config/database');
const therapistStudentModel = require('../models/therapistStudent.model');
const auditService = require('../services/audit.service');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { ApiError } = require('../utils/errors');
const storage = require('../config/storage');

function computeAge(dateOfBirth) {
  if (!dateOfBirth) return null;
  const birth = new Date(dateOfBirth);
  if (Number.isNaN(birth.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function toDto(student, extra = {}) {
  return {
    id: student.id,
    displayName: student.display_name,
    dateOfBirth: student.date_of_birth,
    age: computeAge(student.date_of_birth),
    profileStatus: student.profile_status,
    ...extra,
  };
}

async function getActivePhonemesByStudentIds(studentIds) {
  if (!studentIds.length) return {};
  const rows = await db('progress_records as pr')
    .join('phonemes as p', 'p.id', 'pr.phoneme_id')
    .whereIn('pr.student_id', studentIds)
    .andWhere('pr.mastery_status', 'in_progress')
    .select('pr.student_id', 'p.id as phoneme_id', 'p.character', 'p.name');

  const map = {};
  for (const row of rows) {
    if (!map[row.student_id]) map[row.student_id] = [];
    map[row.student_id].push({ id: row.phoneme_id, character: row.character, name: row.name });
  }
  return map;
}

async function getAssignedPhonemes(studentId) {
  const rows = await db('progress_records as pr')
    .join('phonemes as p', 'p.id', 'pr.phoneme_id')
    .where('pr.student_id', studentId)
    .select('p.id', 'p.character', 'p.name', 'pr.mastery_status');

  return rows.map((r) => ({ id: r.id, character: r.character, name: r.name, masteryStatus: r.mastery_status }));
}

async function getParentDetails(studentId) {
  const rows = await db('parent_student as ps')
    .join('parents as pa', 'pa.id', 'ps.parent_id')
    .join('users as u', 'u.id', 'pa.user_id')
    .where('ps.student_id', studentId)
    .andWhere('ps.status', 'active')
    .select('pa.id', 'u.name', 'u.email', 'ps.relationship');

  return rows.map((r) => ({ id: r.id, name: r.name, email: r.email, relationship: r.relationship }));
}

const listStudents = asyncHandler(async (req, res) => {
  const therapistId = req.roleEntity.id;
  const { phoneme, status, search, therapistId: queryTherapistId } = req.query;

  // `?therapistId` is accepted for parity with the documented query shape,
  // but a therapist may only ever list their own students - this is not an
  // admin-wide lookup.
  if (queryTherapistId && Number(queryTherapistId) !== therapistId) {
    throw new ApiError('FORBIDDEN_RESOURCE', 'You may only list your own assigned students');
  }

  const assignedIds = await therapistStudentModel.listStudentIdsForTherapist(therapistId);
  if (!assignedIds.length) {
    return success(res, { students: [] });
  }

  let query = db('students').whereIn('id', assignedIds);

  if (status) {
    query = query.andWhere({ profile_status: status });
  }
  if (search) {
    query = query.andWhere((qb) => {
      qb.whereRaw('LOWER(display_name) LIKE ?', [`%${String(search).toLowerCase()}%`]);
    });
  }
  if (phoneme) {
    const phonemeIds = await db('progress_records')
      .whereIn('student_id', assignedIds)
      .andWhere({ phoneme_id: phoneme })
      .pluck('student_id');
    query = query.andWhere('students.id', 'in', phonemeIds);
  }

  const students = await query.select('*');
  const activePhonemesByStudent = await getActivePhonemesByStudentIds(students.map((s) => s.id));

  return success(res, {
    students: students.map((s) => toDto(s, { activePhonemes: activePhonemesByStudent[s.id] || [] })),
  });
});

const getStudent = asyncHandler(async (req, res) => {
  await auditService.record(req.user.id, auditService.ACTIONS.STUDENT_VIEW, req.student.id);

  const [assignedPhonemes, parents] = await Promise.all([
    getAssignedPhonemes(req.student.id),
    getParentDetails(req.student.id),
  ]);

  return success(res, toDto(req.student, { assignedPhonemes, parents }));
});

const getStudentDemonstrations = asyncHandler(async (req, res) => {
  const studentId = Number(req.student.id);
  const unlocks = await db('content_unlocks as cu')
    .join('three_d_content as tdc', 'tdc.id', 'cu.content_id')
    .join('phonemes as p', 'p.id', 'cu.phoneme_id')
    .where('cu.student_id', studentId)
    .andWhere('cu.status', 'active')
    .select(
      'cu.id as unlock_id',
      'cu.phoneme_id',
      'p.character as phoneme_character',
      'p.name as phoneme_name',
      'tdc.video_url',
      'cu.unlocked_at',
      'cu.therapist_id'
    );

  return success(res, {
    demonstrations: unlocks.map((u) => ({
      unlockId: u.unlock_id,
      phonemeId: u.phoneme_id,
      phonemeCharacter: u.phoneme_character,
      phonemeName: u.phoneme_name,
      videoUrl: u.video_url ? storage.generatePlaybackUrl(u.video_url) : null,
      unlockedAt: u.unlocked_at,
    })),
  });
});

module.exports = { listStudents, getStudent, getStudentDemonstrations };
