'use strict';

const progressService = require('../services/progress.service');
const phonemeModel = require('../models/phoneme.model');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');

const getStudentProgress = asyncHandler(async (req, res) => {
  const records = await progressService.getStudentProgress(req.student.id);

  const phonemes = await phonemeModel.list();
  const phonemeById = new Map(phonemes.map((p) => [p.id, p]));

  const progress = records.map((r) => ({
    phonemeId: r.phoneme_id,
    phoneme: phonemeById.get(r.phoneme_id)?.character || null,
    masteryStatus: r.mastery_status,
    updatedAt: r.updated_at,
  }));

  return success(res, { progress });
});

function resolveRangeStart(range) {
  const match = /^(\d+)d$/.exec(String(range || ''));
  if (!match) return null;
  const days = Number(match[1]);
  const start = new Date();
  start.setDate(start.getDate() - days);
  return start.toISOString().slice(0, 10);
}

const getPracticeFrequency = asyncHandler(async (req, res) => {
  const { range, from: fromParam, to } = req.query;
  // `?range=30d` is a shorthand for `?from=<today-30d>`; explicit from/to
  // still work and take precedence if both are given.
  const from = fromParam || resolveRangeStart(range);
  const stats = await progressService.getPracticeFrequency(req.student.id, { from, to });

  return success(res, {
    practiceFrequency: stats.map((s) => ({
      date: s.date,
      sessions: s.sessions,
      attempts: s.attempts,
    })),
  });
});

module.exports = { getStudentProgress, getPracticeFrequency };
