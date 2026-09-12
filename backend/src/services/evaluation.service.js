'use strict';

/**
 * Rule-based attempt evaluator. Combines three independent signals -
 * speech-recognition match, audio-feature analysis, mouth-feature analysis -
 * into a single PASS/FAIL result. This is intentionally simple/deterministic
 * (no ML model) so it is easy to test and reason about; the thresholds are
 * engineering config, not a clinical diagnostic claim.
 */
const THRESHOLDS = {
  RECOGNITION_CONFIDENCE: 0.75,
  AUDIO_MATCH_SCORE: 0.6,
  MOUTH_MATCH_SCORE: 0.6,
};

function normalize(text) {
  return String(text || '').trim().toLowerCase();
}

function evaluateAttempt({ targetPhoneme, recognizedText, recognitionConfidence, audioFeatures, mouthFeatures }) {
  const reasons = [];

  const textMatches = normalize(recognizedText) === normalize(targetPhoneme);
  if (!textMatches) reasons.push('recognized_text_mismatch');

  const confidence = Number(recognitionConfidence);
  const confidenceOk = Number.isFinite(confidence) && confidence >= THRESHOLDS.RECOGNITION_CONFIDENCE;
  if (!confidenceOk) reasons.push('low_recognition_confidence');

  const audioScore = audioFeatures && typeof audioFeatures.matchScore === 'number' ? audioFeatures.matchScore : 1;
  const audioOk = audioScore >= THRESHOLDS.AUDIO_MATCH_SCORE;
  if (!audioOk) reasons.push('low_audio_match_score');

  const mouthScore = mouthFeatures && typeof mouthFeatures.matchScore === 'number' ? mouthFeatures.matchScore : 1;
  const mouthOk = mouthScore >= THRESHOLDS.MOUTH_MATCH_SCORE;
  if (!mouthOk) reasons.push('low_mouth_match_score');

  const pass = textMatches && confidenceOk && audioOk && mouthOk;

  return { result: pass ? 'pass' : 'fail', reasons };
}

module.exports = { evaluateAttempt, THRESHOLDS };
