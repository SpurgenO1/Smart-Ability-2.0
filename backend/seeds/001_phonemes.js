'use strict';

// Representative set of Hindi (Devanagari) consonants used as therapy
// targets. `category` follows the traditional grammar classification
// (sparsh = stop consonants, antahstha = semivowels, ushma = sibilants/
// fricatives) so `?category=sparsh` filters as documented; `place` is the
// finer phonetic place of articulation used for articulatory-feature
// tagging below.
const PHONEMES = [
  { character: 'क', name: 'ka', category: 'sparsh', place: 'velar', example_word: 'कबूतर', example_meaning: 'pigeon', image: 'pigeon.png' },
  { character: 'ख', name: 'kha', category: 'sparsh', place: 'velar', example_word: 'खरगोश', example_meaning: 'rabbit', image: 'rabbit.png' },
  { character: 'ग', name: 'ga', category: 'sparsh', place: 'velar', example_word: 'गमला', example_meaning: 'flower pot', image: 'flower-pot.png' },
  { character: 'घ', name: 'gha', category: 'sparsh', place: 'velar', example_word: 'घड़ी', example_meaning: 'clock', image: 'clock.png' },
  { character: 'ङ', name: 'nga', category: 'sparsh', place: 'velar', example_word: 'गंगा', example_meaning: 'Ganges river', image: 'ganga.png' },
  { character: 'च', name: 'cha', category: 'sparsh', place: 'palatal', example_word: 'चम्मच', example_meaning: 'spoon', image: 'spoon.png' },
  { character: 'छ', name: 'chha', category: 'sparsh', place: 'palatal', example_word: 'छतरी', example_meaning: 'umbrella', image: 'umbrella.png' },
  { character: 'ज', name: 'ja', category: 'sparsh', place: 'palatal', example_word: 'जहाज़', example_meaning: 'ship', image: 'ship.png' },
  { character: 'झ', name: 'jha', category: 'sparsh', place: 'palatal', example_word: 'झंडा', example_meaning: 'flag', image: 'flag.png' },
  { character: 'ट', name: 'Ta', category: 'sparsh', place: 'retroflex', example_word: 'टमाटर', example_meaning: 'tomato', image: 'tomato.png' },
  { character: 'ठ', name: 'Tha', category: 'sparsh', place: 'retroflex', example_word: 'ठेला', example_meaning: 'push cart', image: 'cart.png' },
  { character: 'ड', name: 'Da', category: 'sparsh', place: 'retroflex', example_word: 'डमरू', example_meaning: 'small hand drum', image: 'damru.png' },
  { character: 'ढ', name: 'Dha', category: 'sparsh', place: 'retroflex', example_word: 'ढोल', example_meaning: 'drum', image: 'dhol.png' },
  { character: 'त', name: 'ta', category: 'sparsh', place: 'dental', example_word: 'तितली', example_meaning: 'butterfly', image: 'butterfly.png' },
  { character: 'थ', name: 'tha', category: 'sparsh', place: 'dental', example_word: 'थाली', example_meaning: 'plate', image: 'thali.png' },
  { character: 'द', name: 'da', category: 'sparsh', place: 'dental', example_word: 'दरवाज़ा', example_meaning: 'door', image: 'door.png' },
  { character: 'ध', name: 'dha', category: 'sparsh', place: 'dental', example_word: 'धनुष', example_meaning: 'bow', image: 'bow.png' },
  { character: 'न', name: 'na', category: 'sparsh', place: 'dental', example_word: 'नल', example_meaning: 'tap', image: 'tap.png' },
  { character: 'प', name: 'pa', category: 'sparsh', place: 'labial', example_word: 'पतंग', example_meaning: 'kite', image: 'kite.png' },
  { character: 'फ', name: 'pha', category: 'sparsh', place: 'labial', example_word: 'फल', example_meaning: 'fruit', image: 'fruit.png' },
  { character: 'ब', name: 'ba', category: 'sparsh', place: 'labial', example_word: 'बकरी', example_meaning: 'goat', image: 'goat.png' },
  { character: 'भ', name: 'bha', category: 'sparsh', place: 'labial', example_word: 'भालू', example_meaning: 'bear', image: 'bear.png' },
  { character: 'म', name: 'ma', category: 'sparsh', place: 'labial', example_word: 'मछली', example_meaning: 'fish', image: 'fish.png' },
  { character: 'र', name: 'ra', category: 'antahstha', place: 'alveolar', example_word: 'रथ', example_meaning: 'chariot', image: 'chariot.png' },
  { character: 'ल', name: 'la', category: 'antahstha', place: 'alveolar', example_word: 'लट्टू', example_meaning: 'spinning top', image: 'top.png' },
  { character: 'श', name: 'sha', category: 'ushma', place: 'palatal', example_word: 'शेर', example_meaning: 'lion', image: 'lion.png' },
  { character: 'ष', name: 'Sha', category: 'ushma', place: 'retroflex', example_word: 'षटकोण', example_meaning: 'hexagon', image: 'hexagon.png' },
  { character: 'स', name: 'sa', category: 'ushma', place: 'dental', example_word: 'सेब', example_meaning: 'apple', image: 'apple.png' },
];

exports.seed = async function seed(knex) {
  await knex('phoneme_features').del();
  await knex('three_d_content').del();
  await knex('phonemes').del();
  await knex('articulatory_features').del();

  const rows = PHONEMES.map((p) => ({
    character: p.character,
    name: p.name,
    category: p.category,
    example_word: p.example_word,
    example_meaning: p.example_meaning,
    normal_audio_url: `phonemes/${p.name}/normal.mp3`,
    slow_audio_url: `phonemes/${p.name}/slow.mp3`,
    image_url: `images/${p.image}`,
    place_of_articulation: p.place,
    active: true,
  }));

  await knex('phonemes').insert(rows);

  const features = [
    { feature_name: 'velar_place', description: 'Articulated with the back of the tongue against the soft palate.' },
    { feature_name: 'palatal_place', description: 'Articulated with the tongue body against the hard palate.' },
    { feature_name: 'retroflex_place', description: 'Articulated with the tongue tip curled back toward the palate.' },
    { feature_name: 'dental_place', description: 'Articulated with the tongue tip against the upper teeth.' },
    { feature_name: 'labial_place', description: 'Articulated with the lips.' },
    { feature_name: 'alveolar_place', description: 'Articulated with the tongue tip against the alveolar ridge.' },
    { feature_name: 'sibilant_manner', description: 'Produced with a narrow channel creating high-frequency turbulence.' },
    { feature_name: 'liquid_manner', description: 'Produced with partial vocal tract constriction, minimal turbulence.' },
    { feature_name: 'aspirated', description: 'Produced with a strong burst of breath.' },
    { feature_name: 'voiced', description: 'Produced with vocal fold vibration.' },
    { feature_name: 'nasal_manner', description: 'Produced with airflow through the nasal cavity.' },
  ];
  await knex('articulatory_features').insert(features);

  const phonemeRows = await knex('phonemes').select('id', 'category', 'place_of_articulation', 'name');
  const featureRows = await knex('articulatory_features').select('id', 'feature_name');
  const featureIdByName = Object.fromEntries(featureRows.map((f) => [f.feature_name, f.id]));

  const placeToFeature = {
    velar: 'velar_place',
    palatal: 'palatal_place',
    retroflex: 'retroflex_place',
    dental: 'dental_place',
    labial: 'labial_place',
    alveolar: 'alveolar_place',
  };

  const links = [];
  for (const p of phonemeRows) {
    const placeFeature = placeToFeature[p.place_of_articulation];
    if (placeFeature) {
      links.push({ phoneme_id: p.id, feature_id: featureIdByName[placeFeature] });
    }
    if (p.category === 'ushma') {
      links.push({ phoneme_id: p.id, feature_id: featureIdByName.sibilant_manner });
    }
    if (p.category === 'antahstha') {
      links.push({ phoneme_id: p.id, feature_id: featureIdByName.liquid_manner });
    }
    if (p.name.endsWith('ha') && p.name !== 'sha' && p.name !== 'Sha') {
      links.push({ phoneme_id: p.id, feature_id: featureIdByName.aspirated });
    }
    if (['ga', 'gha', 'ja', 'jha', 'Da', 'Dha', 'da', 'dha', 'ba', 'bha', 'ma', 'ra', 'la', 'na', 'nga'].includes(p.name)) {
      links.push({ phoneme_id: p.id, feature_id: featureIdByName.voiced });
    }
    if (['ma', 'nga', 'na'].includes(p.name)) {
      links.push({ phoneme_id: p.id, feature_id: featureIdByName.nasal_manner });
    }
  }
  await knex('phoneme_features').insert(links);

  const contentRows = phonemeRows.map((p) => ({
    phoneme_id: p.id,
    model_url: `content/${p.name}/model.glb`,
    animation_url: `content/${p.name}/mouth-animation.mp4`,
    video_url: `content/${p.name}/tutorial.mp4`,
  }));
  await knex('three_d_content').insert(contentRows);
};
