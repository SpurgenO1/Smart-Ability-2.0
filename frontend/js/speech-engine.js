/**
 * Smart Speech Engine:
 * 1. Slow-Paced Phonetic Cadence Synthesizer (0.5x, 0.75x, 1.0x)
 * 2. Real-Time Web Speech API Recognition & Pronunciation Evaluator
 * 3. Acoustic & Phonetic Distance Scorer
 * 4. Simulation Hooks for Testing Without Microphone
 */

class SpeechEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.cadenceRate = 0.65; // Default slow pediatric cadence
    this._initSpeechRecognition();
  }

  _initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 3;
    }
  }

  setCadence(rate) {
    this.cadenceRate = Math.max(0.4, Math.min(1.2, parseFloat(rate)));
  }

  /**
   * Play target pronunciation with cadence control
   * Can speak syllable-by-syllable with configurable pauses
   */
  speakPhonemeCadence(phonemeObj, level = 'word', onComplete = null, customText = null) {
    if (!('speechSynthesis' in window)) {
      console.warn("Speech synthesis not supported in this browser.");
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    let textToSpeak = customText;
    let lang = phonemeObj.category.includes('English') ? 'en-US' : 'hi-IN';

    if (!textToSpeak) {
      if (level === 'sound') {
        textToSpeak = phonemeObj.soundLevel.target;
      } else if (level === 'word') {
        textToSpeak = phonemeObj.wordLevel.word;
      } else if (level === 'sentence') {
        textToSpeak = phonemeObj.sentenceLevel.sentence;
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = this.cadenceRate;
    utterance.pitch = 1.1; // Slightly higher, friendly pediatric tone

    // Try finding preferred voice
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(lang.slice(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis error", e);
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  }

  /**
   * Speak individual syllables sequentially with clear cadence gap
   */
  speakSyllablesSequentially(syllables, onSyllableActive = null, onComplete = null) {
    if (!('speechSynthesis' in window) || !syllables || syllables.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    window.speechSynthesis.cancel();
    let index = 0;

    const playNext = () => {
      if (index >= syllables.length) {
        if (onComplete) onComplete();
        return;
      }

      const syl = syllables[index];
      // Clean string (e.g. 'क (Ka)' -> 'क')
      const speakText = syl.split('(')[0].trim();
      if (onSyllableActive) onSyllableActive(index, syl);

      const utterance = new SpeechSynthesisUtterance(speakText);
      utterance.rate = this.cadenceRate;
      utterance.pitch = 1.1;

      utterance.onend = () => {
        index++;
        // Cadence pause between syllables (400ms slowed)
        setTimeout(playNext, 450);
      };

      utterance.onerror = () => {
        index++;
        setTimeout(playNext, 300);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();
  }

  /**
   * Start live speech recognition
   */
  startListening({ phoneme, level, onResult, onError, onStart, onEnd }) {
    if (!this.recognition) {
      if (onError) onError({ code: 'not-supported', message: 'Web Speech API not supported in this browser environment. Use Simulation mode.' });
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    const lang = phoneme.category.includes('English') ? 'en-US' : 'hi-IN';
    this.recognition.lang = lang;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (onStart) onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      const confidence = event.results[0][0].confidence || 0.85;

      const evaluation = this.evaluatePronunciation(transcript, phoneme, level, confidence, targetText);
      if (onResult) onResult(evaluation);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (onError) onError(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (onEnd) onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      if (onError) onError(e);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  /**
   * Phonetic comparison and accuracy scoring
   */
  evaluatePronunciation(transcript, phoneme, level, baseConfidence = 0.8, customTarget = null) {
    let target = customTarget;
    if (!target) {
      if (level === 'sound') target = phoneme.soundLevel.target;
      else if (level === 'word') target = phoneme.wordLevel.word;
      else if (level === 'sentence') target = phoneme.sentenceLevel.sentence;
    }

    const cleanTarget = target.toLowerCase().replace(/[।.,?!]/g, '').trim();
    const cleanSpoken = transcript.toLowerCase().replace(/[।.,?!]/g, '').trim();

    // Exact or substring match check
    const isExact = cleanSpoken === cleanTarget;
    const isContained = cleanSpoken.includes(cleanTarget) || cleanTarget.includes(cleanSpoken);

    // Compute Levenshtein similarity
    const sim = this._calculateSimilarity(cleanTarget, cleanSpoken);
    let score = Math.round((sim * 0.7 + baseConfidence * 0.3) * 100);

    if (isExact) score = Math.max(score, 94);
    else if (isContained) score = Math.max(score, 78);

    // Score clamp
    score = Math.min(100, Math.max(20, score));

    const isSuccess = score >= 70;
    let feedback = "";

    if (score >= 88) {
      feedback = "🌟 Outstanding! Clear articulatory placement and crisp release!";
    } else if (score >= 70) {
      feedback = "🎉 Good effort! Target sound produced clearly with minor acoustic deviation.";
    } else if (score >= 50) {
      feedback = `💡 Getting close! ${phoneme.soundLevel.pediatricCue}`;
    } else {
      feedback = `⚠️ Articulation struggle detected. Check tongue placement in the 3D model: ${phoneme.soundLevel.placement}`;
    }

    return {
      transcript: cleanSpoken,
      target: cleanTarget,
      score,
      isSuccess,
      feedback,
      pediatricTip: phoneme.soundLevel.pediatricCue,
      anatomicalHint: phoneme.soundLevel.placement
    };
  }

  /**
   * Simulated evaluation for quick testing and automated demonstration
   */
  simulateEvaluation(phoneme, level, outcomeType = 'success', customTarget = null) {
    let score = 0;
    let transcript = "";
    let isSuccess = false;

    let target = customTarget;
    if (!target) {
      target = level === 'sound' ? phoneme.soundLevel.target : 
               level === 'word' ? phoneme.wordLevel.word : 
               phoneme.sentenceLevel.sentence;
    }

    if (outcomeType === 'success') {
      score = Math.floor(Math.random() * 12) + 88; // 88 - 99
      transcript = target;
      isSuccess = true;
    } else if (outcomeType === 'partial') {
      score = Math.floor(Math.random() * 15) + 70; // 70 - 84
      transcript = target;
      isSuccess = true;
    } else {
      // Struggle / Failure (to test the 5-failure rule)
      score = Math.floor(Math.random() * 20) + 35; // 35 - 54
      // Give common substitution error
      transcript = phoneme.commonError ? (phoneme.commonError.split(':')[1]?.split('->')[0]?.trim() || "Unclear production") : "Unclear production";
      isSuccess = false;
    }

    let feedback = "";
    if (isSuccess) {
      feedback = score >= 88 ? "🌟 Fantastic articulation! Crisp, accurate target sound!" : "👍 Good job! Very clear production!";
    } else {
      feedback = `🌱 Keep trying! Focus on tongue and airflow: ${phoneme.soundLevel.pediatricCue}`;
    }

    return {
      transcript,
      target,
      score,
      isSuccess,
      feedback,
      pediatricTip: phoneme.soundLevel.pediatricCue,
      anatomicalHint: phoneme.soundLevel.placement,
      commonError: phoneme.commonError
    };
  }

  _calculateSimilarity(s1, s2) {
    if (!s1 || !s2) return 0;
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;

    const editDist = this._levenshteinDistance(longer, shorter);
    return (longer.length - editDist) / parseFloat(longer.length);
  }

  _levenshteinDistance(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}

window.speechEngine = new SpeechEngine();
