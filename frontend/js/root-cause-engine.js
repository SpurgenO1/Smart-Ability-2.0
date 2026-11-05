/**
 * ArticuTwin - Root-Cause Clustering Engine
 * Sits between attempt history and the Clinical Teletherapy Assistant.
 * Clusters error patterns by shared articulatory mechanism instead of isolated phonemes,
 * and predicts untested sounds likely to share the same motor deficit.
 */

window.RootCauseEngine = {
  FAIL_THRESHOLD: 80,
  VOTABLE_FEATURES: ['velar_closure', 'tongue_tip', 'tongue_curl', 'lip_closure', 'lateral', 'nasal'],

  computeFeatureVotes: function(fingerprint, compensatoryFlags = {}) {
    const votes = {};
    const failingPhonemes = [];
    fingerprint = fingerprint || { 'क': 60, 'ट': 65, 'प': 90 };

    Object.keys(fingerprint).forEach((phoneme) => {
      const score = fingerprint[phoneme];
      const isFailing = score < this.FAIL_THRESHOLD;
      const isCompensatory = !!compensatoryFlags[phoneme];
      if (!isFailing && !isCompensatory) return;

      const weight = isFailing ? 1.0 : 0.5;
      failingPhonemes.push(phoneme);

      const features = window.ArticulatoryKB[phoneme];
      if (!features) return;

      this.VOTABLE_FEATURES.forEach((f) => {
        if (features[f] === true) {
          votes[f] = (votes[f] || 0) + weight;
        }
      });
      if (features.airflow === 'continuous') {
        votes['airflow_control'] = (votes['airflow_control'] || 0) + weight;
      }
    });

    return { votes, failingPhonemes };
  },

  detectRootCause: function(fingerprint, compensatoryFlags = {}) {
    const { votes, failingPhonemes } = this.computeFeatureVotes(fingerprint, compensatoryFlags);
    const featureKeys = Object.keys(votes);

    if (featureKeys.length === 0 || failingPhonemes.length === 0) {
      return {
        rootCause: null,
        rootCauseLabel: 'Normal Speech Trajectory',
        confidence: 0,
        failingPhonemes: [],
        affectedPhonemes: [],
        recommendations: ['Maintain daily positive speech practice!'],
      };
    }

    let winningFeature = featureKeys[0];
    featureKeys.forEach((f) => {
      if (votes[f] > votes[winningFeature]) winningFeature = f;
    });

    const share = votes[winningFeature] / (failingPhonemes.length || 1);

    const phonemesRequiringFeature = Object.keys(window.ArticulatoryKB).filter((p) => {
      const f = window.ArticulatoryKB[p];
      return f && (f[winningFeature] === true || (winningFeature === 'airflow_control' && f.airflow === 'continuous'));
    });

    const confidence = Math.round(Math.min(96, Math.max(60, share * 100)));

    const recommendationsMap = {
      velar_closure: [
        'Practice posterior tongue elevation with mirror biofeedback.',
        'Target /क/ and /ख/ with back-of-tongue palate contact drills.',
        'Watch the clinical demonstration video for velar occlusion.',
      ],
      tongue_tip: [
        'Practice tongue tip elevation behind the alveolar ridge for /त/ and /द/.',
        'Use gentle tactile prompt against upper incisor ridge.',
      ],
      tongue_curl: [
        'Focus on retroflex tongue curling for /ट/ and /र/.',
        'Encourage child to curl tongue back like an inverted spoon.',
      ],
      lip_closure: [
        'Strengthen bilabial lip seal exercises for /प/ and /म/.',
        'Hold gentle lip closure before vocal burst release.',
      ],
      airflow_control: [
        'Practice steady continuous pulmonary exhalation for fricatives.',
        'Use gentle candle-blowing biofeedback to maintain continuous airflow.',
      ],
    };

    return {
      rootCause: winningFeature,
      rootCauseLabel: window.ArticulatoryFeatureLabels[winningFeature] || winningFeature,
      confidence,
      failingPhonemes,
      affectedPhonemes: phonemesRequiringFeature.slice(0, 6),
      recommendations: recommendationsMap[winningFeature] || ['Continue guided telepractice sessions.'],
    };
  },
};
