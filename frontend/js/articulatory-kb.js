/**
 * ArticuTwin / EchoSeed - Articulatory Knowledge Base
 * Maps Hindi and English phonemes to physical motor articulatory requirements
 * (velar closure, tongue tip elevation, lip closure, airflow control, retroflex curl).
 */

window.ArticulatoryKB = {
  // Hindi Stop Consonants (Sparsh)
  'क': { velar_closure: true, airflow: 'stop', voicing: false, place: 'velar' },
  'ख': { velar_closure: true, airflow: 'stop', voicing: false, place: 'velar', aspirated: true },
  'ग': { velar_closure: true, airflow: 'stop', voicing: true, place: 'velar' },
  'घ': { velar_closure: true, airflow: 'stop', voicing: true, place: 'velar', aspirated: true },
  'ङ': { velar_closure: true, nasal: true, place: 'velar' },

  'च': { tongue_blade: true, airflow: 'stop', voicing: false, place: 'palatal' },
  'छ': { tongue_blade: true, airflow: 'stop', voicing: false, place: 'palatal', aspirated: true },
  'ज': { tongue_blade: true, airflow: 'stop', voicing: true, place: 'palatal' },
  'झ': { tongue_blade: true, airflow: 'stop', voicing: true, place: 'palatal', aspirated: true },

  // Retroflex (Murdhanya)
  'ट': { tongue_tip: true, tongue_curl: true, airflow: 'stop', voicing: false, place: 'retroflex' },
  'ठ': { tongue_tip: true, tongue_curl: true, airflow: 'stop', voicing: false, place: 'retroflex', aspirated: true },
  'ड': { tongue_tip: true, tongue_curl: true, airflow: 'stop', voicing: true, place: 'retroflex' },
  'ढ': { tongue_tip: true, tongue_curl: true, airflow: 'stop', voicing: true, place: 'retroflex', aspirated: true },

  // Dental (Dantya)
  'त': { tongue_tip: true, airflow: 'stop', voicing: false, place: 'dental' },
  'थ': { tongue_tip: true, airflow: 'stop', voicing: false, place: 'dental', aspirated: true },
  'द': { tongue_tip: true, airflow: 'stop', voicing: true, place: 'dental' },
  'ध': { tongue_tip: true, airflow: 'stop', voicing: true, place: 'dental', aspirated: true },
  'न': { tongue_tip: true, nasal: true, place: 'alveolar' },

  // Labial (Oshthya)
  'प': { lip_closure: true, airflow: 'stop', voicing: false, place: 'bilabial' },
  'फ': { lip_closure: true, airflow: 'stop', voicing: false, place: 'bilabial', aspirated: true },
  'ब': { lip_closure: true, airflow: 'stop', voicing: true, place: 'bilabial' },
  'भ': { lip_closure: true, airflow: 'stop', voicing: true, place: 'bilabial', aspirated: true },
  'म': { lip_closure: true, nasal: true, place: 'bilabial' },

  // Approximants & Fricatives
  'य': { tongue_blade: true, airflow: 'continuous', voicing: true, place: 'palatal' },
  'र': { tongue_tip: true, tongue_curl: true, airflow: 'continuous', voicing: true, place: 'alveolar' },
  'ल': { tongue_tip: true, lateral: true, airflow: 'continuous', voicing: true, place: 'alveolar' },
  'व': { lip_closure: true, airflow: 'continuous', voicing: true, place: 'labiodental' },
  'श': { tongue_blade: true, airflow: 'continuous', voicing: false, place: 'palatal' },
  'ष': { tongue_tip: true, tongue_curl: true, airflow: 'continuous', voicing: false, place: 'retroflex' },
  'स': { tongue_tip: true, airflow: 'continuous', voicing: false, place: 'dental' },
  'ह': { airflow: 'continuous', voicing: true, place: 'glottal' },

  // Aliases for latin IDs
  ka: { velar_closure: true, airflow: 'stop', voicing: false, place: 'velar' },
  kha: { velar_closure: true, airflow: 'stop', voicing: false, place: 'velar' },
  ga: { velar_closure: true, airflow: 'stop', voicing: true, place: 'velar' },
  ta_retro: { tongue_tip: true, tongue_curl: true, airflow: 'stop', voicing: false, place: 'retroflex' },
  ta_dental: { tongue_tip: true, airflow: 'stop', voicing: false, place: 'dental' },
  pa: { lip_closure: true, airflow: 'stop', voicing: false, place: 'bilabial' },
  sa: { tongue_tip: true, airflow: 'continuous', voicing: false, place: 'dental' },
  ra: { tongue_tip: true, tongue_curl: true, airflow: 'continuous', voicing: true, place: 'alveolar' },
  la: { tongue_tip: true, lateral: true, airflow: 'continuous', voicing: true, place: 'alveolar' },
  na: { tongue_tip: true, nasal: true, place: 'alveolar' },
  ma: { lip_closure: true, nasal: true, place: 'bilabial' },
};

window.ArticulatoryFeatureLabels = {
  velar_closure: 'Posterior Velar Closure (Soft Palate)',
  tongue_tip: 'Tongue-Tip Elevation & Placement',
  tongue_curl: 'Retroflex / Tongue Curl Control',
  lip_closure: 'Bilabial Lip Closure & Seal',
  airflow_control: 'Pulmonary Airflow & Breath Control',
  lateral: 'Lateral Tongue Seal Emission',
  nasal: 'Velic Port Nasal Resonance',
};
