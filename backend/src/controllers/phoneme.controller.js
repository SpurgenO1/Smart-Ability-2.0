'use strict';

const phonemeModel = require('../models/phoneme.model');
const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/apiResponse');
const { ApiError } = require('../utils/errors');
const storage = require('../config/storage');

function toDto(phoneme) {
  return {
    id: phoneme.id,
    character: phoneme.character,
    name: phoneme.name,
    category: phoneme.category,
    placeOfArticulation: phoneme.place_of_articulation,
    exampleWord: phoneme.example_word,
    exampleMeaning: phoneme.example_meaning,
    imageUrl: phoneme.image_url ? storage.generatePlaybackUrl(phoneme.image_url) : null,
    normalAudioUrl: phoneme.normal_audio_url ? storage.generatePlaybackUrl(phoneme.normal_audio_url) : null,
    slowAudioUrl: phoneme.slow_audio_url ? storage.generatePlaybackUrl(phoneme.slow_audio_url) : null,
  };
}

const listPhonemes = asyncHandler(async (req, res) => {
  const phonemes = await phonemeModel.list({ category: req.query.category });
  return success(res, { phonemes: phonemes.map(toDto) });
});

const getPhoneme = asyncHandler(async (req, res) => {
  const phoneme = await phonemeModel.findByIdActive(req.params.phonemeId);
  if (!phoneme) throw new ApiError('PHONEME_NOT_FOUND', 'Phoneme not found');
  return success(res, toDto(phoneme));
});

const getArticulationContent = asyncHandler(async (req, res) => {
  const phoneme = await phonemeModel.findByIdActive(req.params.phonemeId);
  if (!phoneme) throw new ApiError('PHONEME_NOT_FOUND', 'Phoneme not found');

  const [features, threeDContent] = await Promise.all([
    phonemeModel.getFeatures(phoneme.id),
    phonemeModel.getThreeDContent(phoneme.id),
  ]);

  return success(res, {
    phoneme: toDto(phoneme),
    articulatoryFeatures: features.map((f) => ({ id: f.id, name: f.feature_name, description: f.description })),
    content: threeDContent
      ? {
          id: threeDContent.id,
          modelUrl: threeDContent.model_url ? storage.generatePlaybackUrl(threeDContent.model_url) : null,
          animationUrl: threeDContent.animation_url ? storage.generatePlaybackUrl(threeDContent.animation_url) : null,
          videoUrl: threeDContent.video_url ? storage.generatePlaybackUrl(threeDContent.video_url) : null,
        }
      : null,
  });
});

module.exports = { listPhonemes, getPhoneme, getArticulationContent };
