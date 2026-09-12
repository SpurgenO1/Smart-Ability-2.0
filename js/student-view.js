/**
 * Smart Articulation Training System - Student Portal Controller
 * Inside Out Theme, Cute Pet Mascots (Cat, Bunny, Pup), Accessories Boutique,
 * Dedicated 3D/2D Articulation Video Slot (Space for Clinician Videos),
 * Sound -> Word -> Sentence Level Point Gains & 5-Failure Struggle Tracker
 */

class StudentViewController {
  constructor() {
    this.currentPhoneme = getPhonemeById('swar_a') || getPhonemeById('ka');
    this.currentLevel = 'sound'; // 'sound', 'word', 'sentence'
    this.unlockedLevels = new Set(['sound']); // Level 1 starts unlocked; Level 2 unlocks only after passing Level 1
    this.activeWordIndex = 0;
    this.activeSentenceIndex = 0;
    this.consecutiveFailures = 0;
    this.activeCategory = 'all';

    // 3D/2D Video Slot State
    this.activeVideoDimension = '3d'; // '3d' or '2d'
    this.videoSpeed = 1.0;
  }

  init() {
    this.renderPathMap();
    this.renderTileMatrix();
    this.renderPetAvatar();
    this.setupEventListeners();
    this.setupVideoSlot();
    this.setupBoutiqueModal();
    this.updatePetDialogue(`Hi! I'm ${PET_DATA[window.appState.chosenPet].name}! Let's make some awesome speech memories!`);
  }

  setupEventListeners() {
    // Category pill filters
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        this.activeCategory = e.target.dataset.category;
        this.renderPathMap();
        this.renderTileMatrix();
        window.soundSFX.playPop();
      });
    });

    // Pet Selector Buttons (Cat, Bunny, Pup)
    document.querySelectorAll('.pet-choice-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.pet-choice-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const petKey = e.currentTarget.dataset.pet;
        window.appState.setChosenPet(petKey);
        this.renderPetAvatar();
        window.soundSFX.playPop();
        this.updatePetDialogue(PET_DATA[petKey].voiceGreeting);
      });
    });

    // Open Boutique Button in HUD and Mascot stage
    const boutiqueBtns = [document.getElementById('btn-open-boutique'), document.getElementById('stat-pet-btn'), document.getElementById('stat-points')];
    boutiqueBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.openBoutiqueModal();
          window.soundSFX.playPop();
        });
      }
    });

    // Pet Avatar Click Reaction
    const petAvatar = document.getElementById('pet-avatar-wrapper');
    if (petAvatar) {
      petAvatar.addEventListener('click', () => {
        window.soundSFX.playCorrect();
        this.updatePetDialogue(`Practicing '${this.currentPhoneme.symbol}'! ${this.currentPhoneme.soundLevel.pediatricCue}`);
      });
    }

    // Back to map button
    const backBtn = document.getElementById('back-to-map-btn');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.showPathMap();
        window.soundSFX.playPop();
      });
    }

    // Hierarchy Level Tabs (Sound -> Word -> Sentence)
    document.querySelectorAll('.hierarchy-tab-btn').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const btn = e.currentTarget;
        const level = btn.dataset.level;
        this.switchHierarchyLevel(level);
        window.soundSFX.playPop();
      });
    });

    // Cadence speed selector
    document.querySelectorAll('.speed-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.speed-chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        const speed = parseFloat(e.target.dataset.speed);
        window.speechEngine.setCadence(speed);
        window.soundSFX.playPop();
      });
    });

    // Cadence Audio Buttons
    const playAudioBtn = document.getElementById('btn-play-cadence');
    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', () => this.playPhoneticCadence());
    }

    const playSyllablesBtn = document.getElementById('btn-play-syllables');
    if (playSyllablesBtn) {
      playSyllablesBtn.addEventListener('click', () => this.playSyllablesRhythm());
    }

    // Microphone speech recording
    const micBtn = document.getElementById('btn-duo-mic');
    if (micBtn) {
      micBtn.addEventListener('click', () => this.toggleLiveSpeechRecording());
    }

    // Simulation test buttons (Points Gain & 5-Failure Trigger)
    const testSuccessBtn = document.getElementById('btn-test-success');
    if (testSuccessBtn) {
      testSuccessBtn.addEventListener('click', () => {
        const vocab = this.getPhonemeVocabulary(this.currentPhoneme);
        const activeWord = vocab.words[this.activeWordIndex] || this.currentPhoneme.wordLevel;
        const activeSentence = vocab.sentences[this.activeSentenceIndex] || this.currentPhoneme.sentenceLevel;
        const targetText = this.currentLevel === 'sound' ? this.currentPhoneme.soundLevel.target :
                           this.currentLevel === 'word' ? activeWord.word : activeSentence.sentence;

        const res = window.speechEngine.simulateEvaluation(this.currentPhoneme, this.currentLevel, 'success', targetText);
        this.handlePronunciationResult(res);
      });
    }

    const testStruggleBtn = document.getElementById('btn-test-struggle');
    if (testStruggleBtn) {
      testStruggleBtn.addEventListener('click', () => {
        const vocab = this.getPhonemeVocabulary(this.currentPhoneme);
        const activeWord = vocab.words[this.activeWordIndex] || this.currentPhoneme.wordLevel;
        const activeSentence = vocab.sentences[this.activeSentenceIndex] || this.currentPhoneme.sentenceLevel;
        const targetText = this.currentLevel === 'sound' ? this.currentPhoneme.soundLevel.target :
                           this.currentLevel === 'word' ? activeWord.word : activeSentence.sentence;

        const res = window.speechEngine.simulateEvaluation(this.currentPhoneme, this.currentLevel, 'struggle', targetText);
        this.handlePronunciationResult(res);
      });
    }
  }

  /* =========================================================
     CUTE PET SVG AVATAR RENDERING & ACCESSORIES DRESS-UP
     ========================================================= */
  renderPetAvatar() {
    const container = document.getElementById('pet-avatar-wrapper');
    if (!container) return;

    const chosen = window.appState.chosenPet || 'cat';
    const acc = window.appState.equippedAccessory || 'none';

    let petSvg = '';
    if (chosen === 'cat') {
      petSvg = this.generateCatSvg(acc);
    } else if (chosen === 'rabbit') {
      petSvg = this.generateRabbitSvg(acc);
    } else {
      petSvg = this.generatePupSvg(acc);
    }

    container.innerHTML = petSvg;

    // Update pet name label
    const nameEl = document.getElementById('current-pet-name-label');
    if (nameEl) {
      nameEl.textContent = PET_DATA[chosen].name;
    }
  }

  generateCatSvg(accessory) {
    const accLayer = this.getAccessorySvgLayer(accessory, 'cat');
    return `
      <svg class="pet-svg-art" viewBox="0 0 200 200">
        <!-- Cape (back) -->
        ${accessory === 'hero_cape' ? '<path d="M 60 120 Q 30 180 50 190 Q 100 170 150 190 Q 170 180 140 120 Z" fill="#ef4444" />' : ''}
        <!-- Ears -->
        <polygon points="50,90 70,30 95,75" fill="#f97316" stroke="#ea580c" stroke-width="4" stroke-linejoin="round" />
        <polygon points="56,84 72,42 90,74" fill="#ffedd5" />
        <polygon points="150,90 130,30 105,75" fill="#f97316" stroke="#ea580c" stroke-width="4" stroke-linejoin="round" />
        <polygon points="144,84 128,42 110,74" fill="#ffedd5" />
        <!-- Head -->
        <ellipse cx="100" cy="115" rx="60" ry="50" fill="#fb923c" stroke="#ea580c" stroke-width="4" />
        <!-- Cheeks -->
        <ellipse cx="70" cy="126" rx="10" ry="7" fill="#fda4af" opacity="0.7" />
        <ellipse cx="130" cy="126" rx="10" ry="7" fill="#fda4af" opacity="0.7" />
        <!-- Big Joyful Eyes -->
        <ellipse cx="76" cy="106" rx="12" ry="16" fill="#1e293b" />
        <circle cx="79" cy="100" r="5" fill="#ffffff" />
        <ellipse cx="124" cy="106" rx="12" ry="16" fill="#1e293b" />
        <circle cx="127" cy="100" r="5" fill="#ffffff" />
        <!-- Nose -->
        <polygon points="96,120 104,120 100,126" fill="#f43f5e" />
        <!-- Mouth with cute speech tongue -->
        <path d="M 94 128 Q 100 134 106 128" fill="none" stroke="#7c2d12" stroke-width="3" stroke-linecap="round" />
        <path d="M 97 132 Q 100 142 103 132 Z" fill="#ff4b4b" />
        <!-- Whiskers -->
        <line x1="42" y1="116" x2="18" y2="110" stroke="#c2410c" stroke-width="3" stroke-linecap="round" />
        <line x1="40" y1="126" x2="16" y2="128" stroke="#c2410c" stroke-width="3" stroke-linecap="round" />
        <line x1="158" y1="116" x2="182" y2="110" stroke="#c2410c" stroke-width="3" stroke-linecap="round" />
        <line x1="160" y1="126" x2="184" y2="128" stroke="#c2410c" stroke-width="3" stroke-linecap="round" />
        <!-- Accessory Overlay (Hats, Bows, Glasses, Scarf) -->
        ${accLayer}
      </svg>
    `;
  }

  generateRabbitSvg(accessory) {
    const accLayer = this.getAccessorySvgLayer(accessory, 'rabbit');
    return `
      <svg class="pet-svg-art" viewBox="0 0 200 200">
        <!-- Cape (back) -->
        ${accessory === 'hero_cape' ? '<path d="M 60 120 Q 30 180 50 190 Q 100 170 150 190 Q 170 180 140 120 Z" fill="#3b82f6" />' : ''}
        <!-- Long Bunny Ears -->
        <ellipse cx="70" cy="50" rx="16" ry="46" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" transform="rotate(-8 70 50)" />
        <ellipse cx="70" cy="50" rx="9" ry="36" fill="#fbcfe8" transform="rotate(-8 70 50)" />
        <ellipse cx="130" cy="50" rx="16" ry="46" fill="#f8fafc" stroke="#cbd5e1" stroke-width="4" transform="rotate(8 130 50)" />
        <ellipse cx="130" cy="50" rx="9" ry="36" fill="#fbcfe8" transform="rotate(8 130 50)" />
        <!-- Head -->
        <ellipse cx="100" cy="120" rx="56" ry="50" fill="#ffffff" stroke="#cbd5e1" stroke-width="4" />
        <!-- Cheeks -->
        <ellipse cx="68" cy="132" rx="10" ry="7" fill="#f472b6" opacity="0.6" />
        <ellipse cx="132" cy="132" rx="10" ry="7" fill="#f472b6" opacity="0.6" />
        <!-- Eyes -->
        <ellipse cx="75" cy="112" rx="11" ry="15" fill="#38bdf8" />
        <circle cx="75" cy="112" r="8" fill="#0f172a" />
        <circle cx="78" cy="108" r="4" fill="#ffffff" />
        <ellipse cx="125" cy="112" rx="11" ry="15" fill="#38bdf8" />
        <circle cx="125" cy="112" r="8" fill="#0f172a" />
        <circle cx="128" cy="108" r="4" fill="#ffffff" />
        <!-- Pink Bunny Nose -->
        <polygon points="96,126 104,126 100,132" fill="#ec4899" />
        <!-- Happy Bunny Teeth & Tongue -->
        <rect x="96" y="132" width="8" height="7" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" rx="2" />
        <path d="M 97 139 Q 100 148 103 139 Z" fill="#ff4b4b" />
        <!-- Accessory Overlay -->
        ${accLayer}
      </svg>
    `;
  }

  generatePupSvg(accessory) {
    const accLayer = this.getAccessorySvgLayer(accessory, 'pup');
    return `
      <svg class="pet-svg-art" viewBox="0 0 200 200">
        <!-- Cape (back) -->
        ${accessory === 'hero_cape' ? '<path d="M 60 120 Q 30 180 50 190 Q 100 170 150 190 Q 170 180 140 120 Z" fill="#8b5cf6" />' : ''}
        <!-- Floppy Puppy Ears -->
        <path d="M 50 90 Q 20 120 40 160 Q 65 140 60 100 Z" fill="#78350f" stroke="#451a03" stroke-width="3" />
        <path d="M 150 90 Q 180 120 160 160 Q 135 140 140 100 Z" fill="#78350f" stroke="#451a03" stroke-width="3" />
        <!-- Head -->
        <ellipse cx="100" cy="116" rx="58" ry="50" fill="#d97706" stroke="#b45309" stroke-width="4" />
        <!-- Snout -->
        <ellipse cx="100" cy="132" rx="28" ry="22" fill="#ffedd5" stroke="#fcd34d" stroke-width="2" />
        <!-- Eyes with puppy shine -->
        <ellipse cx="76" cy="106" rx="11" ry="15" fill="#1e293b" />
        <circle cx="79" cy="102" r="5" fill="#ffffff" />
        <ellipse cx="124" cy="106" rx="11" ry="15" fill="#1e293b" />
        <circle cx="127" cy="102" r="5" fill="#ffffff" />
        <!-- Puppy Nose -->
        <ellipse cx="100" cy="125" rx="12" ry="9" fill="#1e293b" />
        <!-- Tongue Panting -->
        <path d="M 94 136 Q 100 156 106 136 Z" fill="#ff4b4b" stroke="#dc2626" stroke-width="2" />
        <!-- Accessory Overlay -->
        ${accLayer}
      </svg>
    `;
  }

  getAccessorySvgLayer(accessory, petType) {
    if (!accessory || accessory === 'none') return '';

    const yOffset = petType === 'rabbit' ? 5 : 0;

    switch (accessory) {
      case 'party_hat':
        return `
          <polygon points="100,${15 + yOffset} 75,${70 + yOffset} 125,${70 + yOffset}" fill="url(#partyGrad)" stroke="#f59e0b" stroke-width="3" />
          <circle cx="100" cy="${14 + yOffset}" r="8" fill="#ffd500" />
          <circle cx="90" cy="${45 + yOffset}" r="3" fill="#ffffff" />
          <circle cx="110" cy="${55 + yOffset}" r="4" fill="#ec4899" />
          <defs>
            <linearGradient id="partyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3b82f6" />
              <stop offset="50%" stop-color="#ec4899" />
              <stop offset="100%" stop-color="#ffd500" />
            </linearGradient>
          </defs>
        `;
      case 'pink_bow':
        return `
          <g transform="translate(100, ${68 + yOffset})">
            <polygon points="-24,-14 0,0 -24,14" fill="#ec4899" stroke="#be185d" stroke-width="2" />
            <polygon points="24,-14 0,0 24,14" fill="#ec4899" stroke="#be185d" stroke-width="2" />
            <circle cx="0" cy="0" r="8" fill="#f43f5e" />
          </g>
        `;
      case 'cool_shades':
        return `
          <g transform="translate(0, 5)">
            <rect x="58" y="94" width="38" height="24" rx="8" fill="#0f172a" stroke="#ffd500" stroke-width="3" />
            <rect x="104" y="94" width="38" height="24" rx="8" fill="#0f172a" stroke="#ffd500" stroke-width="3" />
            <line x1="96" y1="102" x2="104" y2="102" stroke="#ffd500" stroke-width="4" />
            <!-- Lens glint -->
            <line x1="64" y1="98" x2="74" y2="114" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
            <line x1="110" y1="98" x2="120" y2="114" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
          </g>
        `;
      case 'gold_crown':
        return `
          <g transform="translate(100, ${65 + yOffset})">
            <polygon points="-35,0 -28,-30 -10,-12 0,-34 10,-12 28,-30 35,0" fill="#ffd500" stroke="#b45309" stroke-width="3" />
            <circle cx="-28" cy="-30" r="4" fill="#ef4444" />
            <circle cx="0" cy="-34" r="5" fill="#3b82f6" />
            <circle cx="28" cy="-30" r="4" fill="#10b981" />
            <rect x="-35" y="0" width="70" height="6" fill="#f59e0b" rx="3" />
          </g>
        `;
      case 'warm_scarf':
        return `
          <path d="M 65 150 Q 100 170 135 150 Q 140 162 130 172 Q 100 185 70 172 Z" fill="#0284c7" stroke="#0369a1" stroke-width="3" />
          <rect x="110" y="156" width="18" height="34" rx="4" fill="#38bdf8" stroke="#0284c7" stroke-width="2" />
        `;
      case 'flower_pin':
        return `
          <g transform="translate(132, ${75 + yOffset})">
            <circle cx="-8" cy="0" r="8" fill="#f472b6" />
            <circle cx="8" cy="0" r="8" fill="#f472b6" />
            <circle cx="0" cy="-8" r="8" fill="#f472b6" />
            <circle cx="0" cy="8" r="8" fill="#f472b6" />
            <circle cx="0" cy="0" r="6" fill="#ffd500" />
          </g>
        `;
      case 'magic_star':
        return `
          <g transform="translate(68, ${75 + yOffset})">
            <polygon points="0,-16 4,-4 16,-4 7,4 10,16 0,8 -10,16 -7,4 -16,-4 -4,-4" fill="#ffd500" stroke="#f59e0b" stroke-width="2" />
          </g>
        `;
      default:
        return '';
    }
  }

  /* =========================================================
     PET BOUTIQUE & DRESS-UP ACCESSORIES MODAL LOGIC
     ========================================================= */
  setupBoutiqueModal() {
    const closeBtn = document.getElementById('btn-close-boutique');
    const backdrop = document.getElementById('boutique-modal-backdrop');

    if (closeBtn && backdrop) {
      closeBtn.addEventListener('click', () => {
        backdrop.classList.remove('active');
        window.soundSFX.playPop();
      });

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) {
          backdrop.classList.remove('active');
        }
      });
    }
  }

  openBoutiqueModal() {
    const backdrop = document.getElementById('boutique-modal-backdrop');
    if (!backdrop) return;

    this.renderBoutiqueItems();
    backdrop.classList.add('active');
  }

  renderBoutiqueItems() {
    const grid = document.getElementById('boutique-catalog-grid');
    const pointsSpan = document.getElementById('boutique-points-display');
    const previewBox = document.getElementById('boutique-pet-preview-box');

    if (pointsSpan) pointsSpan.textContent = `${window.appState.points} 🔮`;

    // Render current pet in preview
    if (previewBox) {
      const chosen = window.appState.chosenPet || 'cat';
      const acc = window.appState.equippedAccessory || 'none';
      let svg = chosen === 'cat' ? this.generateCatSvg(acc) : chosen === 'rabbit' ? this.generateRabbitSvg(acc) : this.generatePupSvg(acc);
      previewBox.innerHTML = svg;
    }

    if (!grid) return;
    grid.innerHTML = '';

    ACCESSORIES_CATALOG.forEach(item => {
      const isUnlocked = window.appState.unlockedAccessories.has(item.id);
      const isEquipped = window.appState.equippedAccessory === item.id;

      const card = document.createElement('div');
      card.className = `accessory-card ${isEquipped ? 'equipped' : ''}`;

      let actionLabel = '';
      if (isEquipped) actionLabel = '✅ Wearing';
      else if (isUnlocked) actionLabel = '👔 Equip';
      else actionLabel = `Buy: ${item.cost} 🔮`;

      card.innerHTML = `
        <div class="accessory-icon">${item.icon}</div>
        <div class="accessory-name">${item.name}</div>
        <div class="accessory-cost">${actionLabel}</div>
      `;

      card.addEventListener('click', () => {
        if (isEquipped) return;

        if (isUnlocked) {
          // Equip it
          window.soundSFX.playPop();
          window.appState.equipAccessory(item.id);
          this.renderBoutiqueItems();
        } else {
          // Try buying it
          if (window.appState.spendPoints(item.cost)) {
            window.soundSFX.playUnlockCheer();
            window.appState.unlockedAccessories.add(item.id);
            window.appState.equipAccessory(item.id);
            this.renderBoutiqueItems();
          } else {
            window.soundSFX.playGentleTryAgain();
            window.appState.showToast('Not enough points!', `You need ${item.cost} 🔮 to get ${item.name}. Complete more speech levels to earn points!`, 'alert');
          }
        }
      });

      grid.appendChild(card);
    });
  }

  updatePetDialogue(text) {
    const bubble = document.getElementById('pet-speech-text');
    if (bubble) bubble.textContent = text;
  }

  /* =========================================================
     DEDICATED 3D & 2D ARTICULATION VIDEO SLOT (User's Videos)
     ========================================================= */
  setupVideoSlot() {
    // 3D vs 2D dimension toggle
    const btn3D = document.getElementById('btn-slot-3d');
    const btn2D = document.getElementById('btn-slot-2d');

    if (btn3D && btn2D) {
      btn3D.addEventListener('click', () => {
        btn3D.classList.add('active');
        btn2D.classList.remove('active');
        this.activeVideoDimension = '3d';
        this.updateVideoSlotDisplay();
        window.soundSFX.playPop();
      });

      btn2D.addEventListener('click', () => {
        btn2D.classList.add('active');
        btn3D.classList.remove('active');
        this.activeVideoDimension = '2d';
        this.updateVideoSlotDisplay();
        window.soundSFX.playPop();
      });
    }

    // Video Speed Controls
    const speedBtn = document.getElementById('btn-video-speed-toggle');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (this.videoSpeed === 1.0) this.videoSpeed = 0.5;
        else if (this.videoSpeed === 0.5) this.videoSpeed = 0.75;
        else this.videoSpeed = 1.0;

        speedBtn.textContent = `⚡ ${this.videoSpeed}x Speed`;
        const video = document.getElementById('embedded-custom-video');
        if (video) video.playbackRate = this.videoSpeed;
        window.soundSFX.playPop();
      });
    }

    // Custom File Upload Input for Clinicians / Developers
    const fileInput = document.getElementById('custom-video-file-input');
    const uploadTrigger = document.getElementById('btn-trigger-video-upload');

    if (uploadTrigger && fileInput) {
      uploadTrigger.addEventListener('click', () => fileInput.click());

      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const videoUrl = URL.createObjectURL(file);
          this.loadCustomVideoSource(videoUrl, file.name);
        }
      });
    }

    this.updateVideoSlotDisplay();
  }

  updateVideoSlotDisplay() {
    const titleEl = document.getElementById('video-slot-dim-title');
    const promptEl = document.getElementById('slot-main-prompt');
    const subPromptEl = document.getElementById('slot-sub-prompt');
    const iconEl = document.getElementById('slot-film-icon');
    const video = document.getElementById('embedded-custom-video');
    const poster = document.getElementById('video-poster-stage');
    const badge = document.getElementById('badge-video-status');
    const callout = document.getElementById('student-demo-unlocked-callout');
    const calloutTitle = document.getElementById('demo-callout-title');
    const calloutText = document.getElementById('demo-callout-text');

    const currentStudentId = window.appState ? window.appState.activeStudentId : 'ORB-4819';
    const studentInfo = (window.appState && window.appState.studentsDirectory[currentStudentId]) || { name: 'Student' };
    const studentName = studentInfo.name;

    const demoStatus = window.appState ? window.appState.getStudentDemonstrationStatus(currentStudentId, this.currentPhoneme.id) : { status: 'locked' };
    const isApproved = demoStatus.status === 'approved';
    const isRejected = demoStatus.status === 'rejected';

    if (isApproved) {
      // APPROVED & PUSHED EXCLUSIVELY TO THIS STUDENT
      if (badge) {
        badge.className = 'badge-3d-status unlocked';
        badge.textContent = `🔓 Clinical Video Approved for ${studentName}`;
      }
      if (callout) {
        callout.style.display = 'flex';
        if (calloutTitle) calloutTitle.textContent = `🎬 Clinical Demonstration Pushed for ${studentName}!`;
        if (calloutText) calloutText.textContent = `Dr. Ritu Nair reviewed your 5 practice attempts on '${this.currentPhoneme.symbol}' and pushed this video demonstration exclusively for you. Watch the tongue articulation below!`;
      }
      if (video) {
        video.src = demoStatus.videoUrl || 'assets/videos/vowel_1.mp4';
        video.style.display = 'block';
      }
      if (poster) poster.style.display = 'none';

      if (titleEl) titleEl.textContent = 'Clinical Demonstration Video';
      if (iconEl) iconEl.textContent = '🎬';
      if (promptEl) promptEl.textContent = `Clinical Demonstration for '${this.currentPhoneme.symbol}'`;
      if (subPromptEl) subPromptEl.textContent = `Unlocked exclusively for ${studentName}. Follow the visual model to correct tongue placement!`;

    } else if (isRejected) {
      // REJECTED FOR THIS STUDENT - FOCUS ON IN-PERSON COACHING
      if (badge) {
        badge.className = 'badge-3d-status rejected';
        badge.textContent = `📋 In-Session Clinical Coaching Focus`;
      }
      if (callout) callout.style.display = 'none';
      if (video) {
        video.style.display = 'none';
        video.pause();
      }
      if (poster) poster.style.display = 'flex';

      if (titleEl) titleEl.textContent = 'In-Session Articulation Focus';
      if (iconEl) iconEl.textContent = '📋';
      if (promptEl) promptEl.textContent = `Live Session Guidance: '${this.currentPhoneme.symbol}'`;
      if (subPromptEl) subPromptEl.textContent = `Dr. Ritu reviewed your attempts and recommended live tactile placement coaching in your next 1-on-1 session: "${demoStatus.reason || 'Practice with therapist'}"`;

    } else {
      // LOCKED FOR THIS STUDENT (Not approved, or another student's video)
      if (badge) {
        badge.className = 'badge-3d-status locked';
        badge.textContent = `🔒 Clinical Demonstration Video Locked`;
      }
      if (callout) callout.style.display = 'none';
      if (video) {
        video.style.display = 'none';
        video.pause();
      }
      if (poster) poster.style.display = 'flex';

      if (titleEl) titleEl.textContent = this.activeVideoDimension === '3d' ? '3D Vocal Tract Video' : '2D Sagittal Video';
      if (iconEl) iconEl.textContent = '🔒';
      if (promptEl) promptEl.textContent = `Clinical Video Locked for ${studentName}`;
      if (subPromptEl) {
        subPromptEl.textContent = `This clinical video demonstration is individually approved by SLP Dr. Ritu Nair when targeted assistance is needed (5-failure struggle rule).`;
      }
    }
  }

  loadCustomVideoSource(url, fileName = '') {
    const video = document.getElementById('embedded-custom-video');
    const poster = document.getElementById('video-poster-stage');

    if (video && poster) {
      video.src = url;
      video.classList.add('active');
      poster.style.display = 'none';
      video.play();

      window.soundSFX.playUnlockCheer();
      window.appState.showToast('🎥 Custom Video Loaded', `Playing ${fileName || 'your articulatory video'}!`, 'unlock');
    }
  }

  /* =========================================================
     DUOLINGO PATH MAP & PHONEME HUB
     ========================================================= */
  renderPathMap() {
    const pathColumn = document.getElementById('duo-path-column');
    if (!pathColumn) return;

    // Ensure any legacy SVG is removed
    const oldSvg = pathColumn.querySelector('.duo-path-spline');
    if (oldSvg) oldSvg.remove();

    const studentSwitcher = document.getElementById('select-active-student');
    if (studentSwitcher && window.appState) {
      studentSwitcher.value = window.appState.activeStudentId || 'ORB-4819';
    }

    const phonemes = this.getFilteredPhonemes();
    pathColumn.innerHTML = '';

    // Symmetrical alternating zig-zag sequence centered along the column axis
    const alignments = [
      'pos-center',
      'pos-right',
      'pos-far-right',
      'pos-right',
      'pos-center',
      'pos-left',
      'pos-far-left',
      'pos-left'
    ];
    let lastGroup = null;

    const activeId = window.appState.activeTargetPhonemeId || 'swar_aa';
    const completedSet = window.appState.completedPhonemes || new Set();

    phonemes.forEach((phoneme, idx) => {
      // Milestone section divider when group changes
      if (phoneme.group && phoneme.group !== lastGroup) {
        lastGroup = phoneme.group;
        const sectionDivider = document.createElement('div');
        sectionDivider.className = 'duo-path-section-divider';
        sectionDivider.innerHTML = `
          <div class="duo-path-section-title">${phoneme.groupTitle || 'Speech Trail Section'}</div>
        `;
        pathColumn.appendChild(sectionDivider);
      }

      const row = document.createElement('div');
      row.className = `duo-path-node-row ${alignments[idx % alignments.length]}`;

      const isCompleted = completedSet.has(phoneme.id);
      const isActiveTarget = (phoneme.id === activeId);

      const btn = document.createElement('button');
      let statusClasses = '';
      if (isCompleted) statusClasses += ' completed';
      if (isActiveTarget) statusClasses += ' active-target';

      btn.className = `duo-node-btn ${phoneme.emotion || 'orb-joy'}${statusClasses}`;
      btn.dataset.phonemeId = phoneme.id;

      const isUnlocked = phoneme.unlocked3D || window.appState.unlockedPhonemes.has(phoneme.id);
      const badgeHtml = isUnlocked ? `<span class="unlocked-3d-ribbon">🎬 3D Video</span>` : '';

      // Floating pointer bubble for the glowing active target
      let pointerBubble = '';
      if (isActiveTarget) {
        pointerBubble = `<div class="next-target-bubble">START! 🌟</div>`;
      }
      const starMilestone = isCompleted ? `<span class="completed-milestone-star" title="Mastered Sound">⭐</span>` : '';

      btn.innerHTML = `
        ${pointerBubble}
        ${badgeHtml}
        ${starMilestone}
        <span class="node-letter">${phoneme.symbol}</span>
        <span class="node-sub">${phoneme.id.toUpperCase()}</span>
      `;

      btn.addEventListener('click', () => {
        window.appState.setActiveTargetPhoneme(phoneme.id);
        this.openPracticeRoom(phoneme);
        window.soundSFX.playPop();
      });

      row.appendChild(btn);
      pathColumn.appendChild(row);
    });
  }

  renderTileMatrix() {
    const grid = document.getElementById('tile-grid-container');
    if (!grid) return;

    const phonemes = this.getFilteredPhonemes();
    grid.innerHTML = '';

    phonemes.forEach(phoneme => {
      const card = document.createElement('div');
      card.className = `phoneme-tile-card ${phoneme.id === this.currentPhoneme.id ? 'active' : ''}`;
      
      const isUnlocked = phoneme.unlocked3D || window.appState.unlockedPhonemes.has(phoneme.id);
      const badge = isUnlocked ? `<span class="tile-badge-3d">🎬 Video Ready</span>` : '';

      card.innerHTML = `
        ${badge}
        <div class="tile-letter">${phoneme.symbol}</div>
        <div class="tile-word-pairing">${phoneme.wordLevel.emoji} ${phoneme.wordLevel.word}</div>
      `;

      card.addEventListener('click', () => {
        this.openPracticeRoom(phoneme);
        window.soundSFX.playPop();
      });

      card.addEventListener('mouseenter', () => {
        window.speechEngine.speakPhonemeCadence(phoneme, 'sound');
      });

      grid.appendChild(card);
    });
  }

  getFilteredPhonemes() {
    const all = getAllPhonemes('hindi');
    if (this.activeCategory === 'swar') {
      return all.filter(p => p.group === 'swar');
    }
    if (this.activeCategory === 'sparsh') {
      return all.filter(p => ['kavarga', 'chavarga', 'tavarga_retro', 'tavarga_dental', 'pavarga'].includes(p.group));
    }
    if (this.activeCategory === 'anthastha') {
      return all.filter(p => p.group === 'anthastha');
    }
    if (this.activeCategory === 'ushma') {
      return all.filter(p => p.group === 'ushma');
    }
    if (this.activeCategory === 'blends') {
      return all.filter(p => p.group === 'blends');
    }
    return all;
  }

  filterAndScroll(category) {
    document.querySelectorAll('.category-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.category === category);
    });
    this.activeCategory = category;
    this.renderPathMap();
    this.renderTileMatrix();
    if (window.soundSFX) window.soundSFX.playPop();
    const pathCol = document.getElementById('duo-path-column');
    if (pathCol) {
      pathCol.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  getPhonemeVocabulary(phoneme) {
    if (typeof window.getPhonemeVocabulary === 'function') {
      return window.getPhonemeVocabulary(phoneme);
    }
    return {
      words: [phoneme.wordLevel],
      sentences: [phoneme.sentenceLevel]
    };
  }

  async openPracticeRoom(phoneme) {
    this.currentPhoneme = phoneme;
    this.consecutiveFailures = 0;
    this.activeWordIndex = 0;
    this.activeSentenceIndex = 0;
    this.updateAttemptCounterUI();

    // Default to Level 1 (Sound Level)
    this.currentLevel = 'sound';
    const isCompleted = window.appState && window.appState.completedPhonemes.has(phoneme.id);
    this.unlockedLevels = isCompleted ? new Set(['sound', 'word', 'sentence']) : new Set(['sound']);

    document.getElementById('student-map-subview').classList.remove('active');
    document.getElementById('student-practice-subview').classList.add('active');

    this.updatePracticeStageUI();
    this.updateVideoSlotDisplay();
    this.updatePetDialogue(`Awesome! Let's practice '${phoneme.symbol}' (${phoneme.name})! Complete Level 1 (Sound) to unlock Level 2 (Word)!`);

    await this.ensureBackendSession();
  }

  showPathMap() {
    document.getElementById('student-practice-subview').classList.remove('active');
    document.getElementById('student-map-subview').classList.add('active');
    this.renderPathMap();
    this.renderTileMatrix();
  }

  completeAndReturnToTrail() {
    window.appState.markPhonemeCompleted(this.currentPhoneme.id);
    this.showPathMap();
    if (window.soundSFX) window.soundSFX.playCorrect();
    setTimeout(() => {
      const activeBtn = document.querySelector('.duo-node-btn.active-target');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  }

  switchHierarchyLevel(level) {
    if (!this.unlockedLevels.has(level)) {
      const required = level === 'sentence' ? 'Level 2 (Word Level)' : 'Level 1 (Sound Level)';
      if (window.soundSFX) window.soundSFX.playGentleTryAgain();
      window.appState.showToast(
        '🔒 Level Locked',
        `Complete ${required} first with 80%+ accuracy to unlock ${level === 'sentence' ? 'Level 3' : 'Level 2'}!`,
        'alert'
      );
      this.updatePetDialogue(`Complete ${required} first, then we'll unlock ${level === 'sentence' ? 'Level 3' : 'Level 2'} together! 🌟`);
      return;
    }

    this.currentLevel = level;
    this.updatePracticeStageUI();
    this.hideFeedback();

    const vocab = this.getPhonemeVocabulary(this.currentPhoneme);
    const activeWord = vocab.words[this.activeWordIndex] || this.currentPhoneme.wordLevel;
    const activeSentence = vocab.sentences[this.activeSentenceIndex] || this.currentPhoneme.sentenceLevel;

    if (level === 'sound') {
      this.updatePetDialogue(`Level 1: Sound Level! Say isolated '${this.currentPhoneme.symbol}'. Complete this level to unlock Level 2! (+20 🔮)`);
    } else if (level === 'word') {
      this.updatePetDialogue(`Level 2: Word Level! Practice saying word '${activeWord.word}'. Choose words below to practice! (+35 🔮)`);
    } else if (level === 'sentence') {
      this.updatePetDialogue(`Level 3: Sentence Level! Practice full carrier sentence. Speak clearly! (+50 🔮)`);
    }
  }

  updatePracticeStageUI() {
    const p = this.currentPhoneme;
    if (!p) return;

    const vocab = this.getPhonemeVocabulary(p);
    const activeWord = vocab.words[this.activeWordIndex] || p.wordLevel;
    const activeSentence = vocab.sentences[this.activeSentenceIndex] || p.sentenceLevel;

    // Update Hierarchy Tabs with Locked/Unlocked state
    document.querySelectorAll('.hierarchy-tab-btn').forEach(btn => {
      const lvl = btn.dataset.level;
      const isUnlocked = this.unlockedLevels ? this.unlockedLevels.has(lvl) : true;
      btn.classList.toggle('active', lvl === this.currentLevel);
      btn.classList.toggle('locked', !isUnlocked);

      const labelSpan = btn.querySelector('span:last-child');
      if (labelSpan) {
        if (lvl === 'sound') labelSpan.textContent = '🔊 Sound Level (+20 🔮)';
        else if (lvl === 'word') labelSpan.textContent = isUnlocked ? '📦 Word Level (+35 🔮)' : '🔒 Word Level (+35 🔮)';
        else if (lvl === 'sentence') labelSpan.textContent = isUnlocked ? '💬 Sentence Level (+50 🔮)' : '🔒 Sentence Level (+50 🔮)';
      }
    });

    const titleEl = document.getElementById('current-practice-title');
    if (titleEl) titleEl.textContent = `${p.name} (${p.category || 'Speech Articulation'})`;

    // 1. Level Stage Panes Visibility
    const paneSound = document.getElementById('pane-level-sound');
    const paneWord = document.getElementById('pane-level-word');
    const paneSentence = document.getElementById('pane-level-sentence');

    if (paneSound) paneSound.classList.toggle('active', this.currentLevel === 'sound');
    if (paneWord) paneWord.classList.toggle('active', this.currentLevel === 'word');
    if (paneSentence) paneSentence.classList.toggle('active', this.currentLevel === 'sentence');

    // 2. Populate Level 1 (Sound Pane)
    const soundLetter = document.getElementById('sound-target-letter');
    if (soundLetter) soundLetter.textContent = p.symbol;

    const soundIpa = document.getElementById('sound-target-ipa');
    if (soundIpa) soundIpa.textContent = `${p.ipa} • ${p.category || 'Speech Articulation'}`;

    const soundPediatric = document.getElementById('sound-pediatric-text');
    if (soundPediatric && p.soundLevel) soundPediatric.textContent = p.soundLevel.pediatricCue;

    // 3. Populate Level 2 (Word Pane)
    const wordPhonemeBadge = document.getElementById('word-stage-phoneme-badge');
    if (wordPhonemeBadge) wordPhonemeBadge.textContent = p.symbol;

    const wordEmoji = document.getElementById('word-target-emoji');
    if (wordEmoji) wordEmoji.textContent = activeWord.emoji || '📦';

    const wordTitle = document.getElementById('word-target-title');
    if (wordTitle) wordTitle.textContent = activeWord.word;

    const wordMeaning = document.getElementById('word-target-meaning');
    if (wordMeaning) {
      wordMeaning.textContent = `${activeWord.transliteration || ''} — "${activeWord.meaning || ''}"`;
    }

    // Populate Word Bank Chips
    const wordChipsRow = document.getElementById('word-bank-chips-row');
    if (wordChipsRow) {
      wordChipsRow.innerHTML = '';
      vocab.words.forEach((w, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `word-choice-chip ${idx === this.activeWordIndex ? 'active' : ''}`;
        chip.innerHTML = `<span>${w.emoji || '📦'}</span> <span>${w.word}</span>`;
        chip.title = `Practice word: ${w.word} (${w.meaning})`;
        chip.onclick = () => {
          this.activeWordIndex = idx;
          this.updatePracticeStageUI();
          if (window.soundSFX) window.soundSFX.playPop();
          this.updatePetDialogue(`Switched target word to '${w.word}' (${w.meaning})! Let's practice!`);
        };
        wordChipsRow.appendChild(chip);
      });
    }

    // 4. Populate Level 3 (Sentence Pane)
    const sentencePhonemeBadge = document.getElementById('sentence-stage-phoneme-badge');
    if (sentencePhonemeBadge) sentencePhonemeBadge.textContent = p.symbol;

    const sentenceQuote = document.getElementById('sentence-target-quote');
    if (sentenceQuote) sentenceQuote.textContent = `“${activeSentence.sentence}”`;

    const sentenceTranslit = document.getElementById('sentence-target-translit');
    if (sentenceTranslit) sentenceTranslit.textContent = activeSentence.transliteration || '';

    const sentenceMeaning = document.getElementById('sentence-target-meaning');
    if (sentenceMeaning) sentenceMeaning.textContent = `"${activeSentence.meaning || ''}"`;

    // Populate Sentence Chips
    const sentenceChipsRow = document.getElementById('sentence-chips-row');
    if (sentenceChipsRow) {
      sentenceChipsRow.innerHTML = '';
      vocab.sentences.forEach((s, idx) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = `sentence-choice-chip ${idx === this.activeSentenceIndex ? 'active' : ''}`;
        chip.textContent = `Sentence ${idx + 1}`;
        chip.title = s.sentence;
        chip.onclick = () => {
          this.activeSentenceIndex = idx;
          this.updatePracticeStageUI();
          if (window.soundSFX) window.soundSFX.playPop();
        };
        sentenceChipsRow.appendChild(chip);
      });
    }

    // 5. Syllables Cadence Pills (Only for Word Level)
    const syllableContainer = document.getElementById('syllable-cadence-pills');
    if (syllableContainer) {
      if (this.currentLevel === 'word' && activeWord.syllables && activeWord.syllables.length > 0) {
        syllableContainer.style.display = 'flex';
        syllableContainer.innerHTML = '';
        activeWord.syllables.forEach((syl, i) => {
          const pill = document.createElement('div');
          pill.className = 'syllable-pill';
          pill.id = `syllable-pill-${i}`;
          pill.textContent = syl;
          syllableContainer.appendChild(pill);
        });
      } else {
        syllableContainer.style.display = 'none';
      }
    }

    // 6. Audio Buttons & Actions
    const btnPlayCadence = document.getElementById('btn-play-cadence');
    const btnPlaySyllables = document.getElementById('btn-play-syllables');

    if (btnPlayCadence) {
      if (this.currentLevel === 'sound') {
        btnPlayCadence.textContent = `🔊 Listen Sound ('${p.symbol}')`;
      } else if (this.currentLevel === 'word') {
        btnPlayCadence.textContent = `🔊 Listen Word ('${activeWord.word}')`;
      } else if (this.currentLevel === 'sentence') {
        btnPlayCadence.textContent = `🔊 Listen Full Sentence`;
      }
    }

    if (btnPlaySyllables) {
      btnPlaySyllables.style.display = (this.currentLevel === 'word') ? 'inline-flex' : 'none';
    }

    // 7. Mic Prompt Instruction
    const micPrompt = document.getElementById('mic-action-prompt');
    if (micPrompt) {
      if (this.currentLevel === 'sound') {
        micPrompt.textContent = `🗣️ Tap microphone, speak sound: "${p.symbol}" to earn Memory Orbs!`;
      } else if (this.currentLevel === 'word') {
        micPrompt.textContent = `🗣️ Tap microphone, speak word: "${activeWord.word}" to earn Memory Orbs!`;
      } else if (this.currentLevel === 'sentence') {
        micPrompt.textContent = `🗣️ Tap microphone, speak sentence: "${activeSentence.sentence}" to earn Memory Orbs!`;
      }
    }

    // Clinical Demonstration Video status is refreshed by updateVideoSlotDisplay
    this.updateVideoSlotDisplay();

    const struggleBox = document.getElementById('struggle-alert-box');
    if (struggleBox) struggleBox.classList.remove('active');
  }

  playPhoneticCadence() {
    window.soundSFX.playPop();
    const btn = document.getElementById('btn-play-cadence');
    if (btn) {
      btn.disabled = true;
      btn.textContent = '🔊 Playing...';
    }

    const vocab = this.getPhonemeVocabulary(this.currentPhoneme);
    const activeWord = vocab.words[this.activeWordIndex] || this.currentPhoneme.wordLevel;
    const activeSentence = vocab.sentences[this.activeSentenceIndex] || this.currentPhoneme.sentenceLevel;

    let textToSpeak = this.currentPhoneme.soundLevel.target;
    if (this.currentLevel === 'word') textToSpeak = activeWord.word;
    else if (this.currentLevel === 'sentence') textToSpeak = activeSentence.sentence;

    window.speechEngine.speakPhonemeCadence(this.currentPhoneme, this.currentLevel, () => {
      if (btn) {
        btn.disabled = false;
        if (this.currentLevel === 'sound') btn.textContent = `🔊 Listen Sound ('${this.currentPhoneme.symbol}')`;
        else if (this.currentLevel === 'word') btn.textContent = `🔊 Listen Word ('${activeWord.word}')`;
        else btn.textContent = `🔊 Listen Full Sentence`;
      }
    }, textToSpeak);
  }

  playSyllablesRhythm() {
    window.soundSFX.playPop();
    const vocab = this.getPhonemeVocabulary(this.currentPhoneme);
    const activeWord = vocab.words[this.activeWordIndex] || this.currentPhoneme.wordLevel;
    const syllables = activeWord.syllables || [];

    window.speechEngine.speakSyllablesSequentially(
      syllables,
      (activeIdx) => {
        document.querySelectorAll('.syllable-pill').forEach((pill, idx) => {
          pill.classList.toggle('active', idx === activeIdx);
        });
      },
      () => {
        document.querySelectorAll('.syllable-pill').forEach(pill => pill.classList.remove('active'));
      }
    );
  }

  toggleLiveSpeechRecording() {
    const micBtn = document.getElementById('btn-duo-mic');
    if (!micBtn) return;

    if (window.speechEngine.isListening) {
      window.speechEngine.stopListening();
      micBtn.classList.remove('recording');
      micBtn.innerHTML = '🎤';
      return;
    }

    const vocab = this.getPhonemeVocabulary(this.currentPhoneme);
    const activeWord = vocab.words[this.activeWordIndex] || this.currentPhoneme.wordLevel;
    const activeSentence = vocab.sentences[this.activeSentenceIndex] || this.currentPhoneme.sentenceLevel;
    const targetText = this.currentLevel === 'sound' ? this.currentPhoneme.soundLevel.target :
                       this.currentLevel === 'word' ? activeWord.word : activeSentence.sentence;

    window.speechEngine.startListening({
      phoneme: this.currentPhoneme,
      level: this.currentLevel,
      targetText: targetText,
      onStart: () => {
        micBtn.classList.add('recording');
        micBtn.innerHTML = '⏹️';
        window.soundSFX.playPop();
        this.updatePetDialogue(`Listening for "${targetText}"! Speak clearly!`);
      },
      onResult: (evalResult) => {
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '🎤';
        this.handlePronunciationResult(evalResult);
      },
      onError: (err) => {
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '🎤';
        this.updatePetDialogue("Mic inactive or blocked. Try the 'Testing Controls' buttons below to practice and earn points!");
      },
      onEnd: () => {
        micBtn.classList.remove('recording');
        micBtn.innerHTML = '🎤';
      }
    });
  }

  async ensureBackendSession() {
    if (window.apiClient && window.apiClient.isAuthenticated()) {
      try {
        const studentId = window.appState?.activeStudentDbId || 1;
        const phonemeId = this.currentPhoneme?.backendId || 1;
        const session = await window.apiClient.startPracticeSession(studentId, phonemeId, 'self_practice');
        this.activePracticeSessionId = session.id;
        this.attemptCounter = 0;
        console.log('✅ Active practice session started on server (ID: ' + session.id + ')');
      } catch (e) {
        console.warn('[StudentView] Session start fallback to local:', e.message || e);
      }
    }
  }

  setDemonstrationVideo(videoUrl) {
    const video = document.getElementById('embedded-custom-video');
    const poster = document.getElementById('video-poster-stage');
    const badge = document.getElementById('badge-video-status');
    if (video) {
      video.src = videoUrl;
      video.style.display = 'block';
      video.load();
      video.play().catch(() => {});
    }
    if (poster) poster.style.display = 'none';
    if (badge) {
      badge.className = 'badge-3d-status unlocked';
      badge.textContent = '🔓 Clinical Demonstration Video Unlocked!';
    }
  }

  async handlePronunciationResult(result) {
    const feedbackCard = document.getElementById('feedback-result-card');
    feedbackCard.classList.add('active');

    // Extract audio and CV features for backend
    const audioFeatures = window.AudioFeatureEngine ? window.AudioFeatureEngine.stopAndExtractFeatures() : null;
    const mouthFeatures = window.CvEngine ? window.CvEngine.getLatestMouthFeatures() : null;

    let serverAttempt = null;
    if (window.apiClient && window.apiClient.isAuthenticated() && this.activePracticeSessionId) {
      try {
        this.attemptCounter = (this.attemptCounter || 0) + 1;
        serverAttempt = await window.apiClient.submitPracticeAttempt(this.activePracticeSessionId, {
          attemptNumber: this.attemptCounter,
          targetPhoneme: this.currentPhoneme.symbol,
          recognizedText: result.transcript,
          recognitionConfidence: Number((result.score / 100).toFixed(2)),
          audioFeatures,
          mouthFeatures,
        });

        if (serverAttempt && typeof serverAttempt.consecutiveFailures === 'number') {
          this.consecutiveFailures = serverAttempt.consecutiveFailures;
        }
      } catch (err) {
        console.warn('[StudentView] Backend attempt logging note:', err.message || err);
      }
    }

    if (result.isSuccess) {
      feedbackCard.classList.remove('struggle');
      window.soundSFX.playCorrect();

      this.consecutiveFailures = 0;
      this.updateAttemptCounterUI();

      // LEVEL 1 -> LEVEL 2 -> LEVEL 3 PROGRESSION
      let pointsAwarded = 20;
      let nextStepPrompt = '';
      const advBtn = document.getElementById('btn-advance-next-sound');

      if (this.currentLevel === 'sound') {
        pointsAwarded = 20;
        this.unlockedLevels.add('word');
        nextStepPrompt = `Level 1 (Sound) Mastered! Level 2 (Word: '${this.currentPhoneme.wordLevel.word}') is now UNLOCKED!`;

        if (advBtn) {
          advBtn.style.display = 'block';
          advBtn.innerHTML = `🌟 Level 1 Mastered! Proceed to Level 2 (Word: ${this.currentPhoneme.wordLevel.word}) →`;
          advBtn.onclick = () => {
            this.switchHierarchyLevel('word');
            advBtn.style.display = 'none';
          };
        }
      } else if (this.currentLevel === 'word') {
        pointsAwarded = 35;
        this.unlockedLevels.add('sentence');
        nextStepPrompt = `Level 2 (Word) Mastered! Level 3 (Sentence) is now UNLOCKED!`;

        if (advBtn) {
          advBtn.style.display = 'block';
          advBtn.innerHTML = `🌟 Level 2 Mastered! Proceed to Level 3 (Sentence) →`;
          advBtn.onclick = () => {
            this.switchHierarchyLevel('sentence');
            advBtn.style.display = 'none';
          };
        }
      } else if (this.currentLevel === 'sentence') {
        pointsAwarded = 50;
        window.appState.markPhonemeCompleted(this.currentPhoneme.id);

        const allHindi = getAllPhonemes('hindi');
        const currIdx = allHindi.findIndex(p => p.id === this.currentPhoneme.id);
        const nextP = (currIdx !== -1 && currIdx < allHindi.length - 1) ? allHindi[currIdx + 1] : null;
        nextStepPrompt = nextP ? `All 3 Levels Mastered! Next Sound '${nextP.symbol}' is glowing on your trail!` : 'You completed all letters!';

        if (advBtn) {
          advBtn.style.display = 'block';
          advBtn.innerHTML = `🏆 Sound Mastered! Return to Trail & See Next Glowing Sound →`;
          advBtn.onclick = () => {
            this.completeAndReturnToTrail();
          };
        }
      }

      window.appState.addPoints(pointsAwarded);
      this.updatePracticeStageUI();

      document.getElementById('feedback-score-badge').textContent = `🎯 Accuracy: ${result.score}% (+${pointsAwarded} 🔮)`;
      document.getElementById('feedback-message').textContent = `${result.feedback} • Level Mastered!`;
      document.getElementById('feedback-pediatric-tip').textContent = `🗣️ Spoken: "${result.transcript}" — ${result.pediatricTip} — ${nextStepPrompt}`;

      this.updatePetDialogue(`🌟 YAY! Accuracy: ${result.score}%! (+${pointsAwarded} 🔮). ${nextStepPrompt}`);
      this.triggerConfetti();

    } else {
      feedbackCard.classList.add('struggle');
      window.soundSFX.playGentleTryAgain();

      if (!serverAttempt) {
        this.consecutiveFailures += 1;
      }
      this.updateAttemptCounterUI();

      document.getElementById('feedback-score-badge').textContent = `🌱 Score: ${result.score}% (Placement Adjustment Needed)`;
      document.getElementById('feedback-message').textContent = result.feedback;
      document.getElementById('feedback-pediatric-tip').textContent = `💡 Hint: ${result.pediatricTip}`;

      if (this.consecutiveFailures >= 5) {
        this.trigger5FailureStruggleAlert();
      } else {
        this.updatePetDialogue(`Nice try! ${5 - this.consecutiveFailures} attempts left before alerting Dr. Ritu for video help.`);
      }
    }
  }

  updateAttemptCounterUI() {
    const dotsContainer = document.getElementById('attempt-dots');
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const dot = document.createElement('div');
      dot.className = `attempt-dot ${i <= this.consecutiveFailures ? 'failed' : ''}`;
      dotsContainer.appendChild(dot);
    }

    const countText = document.getElementById('attempt-count-text');
    if (countText) {
      countText.textContent = `Attempt ${this.consecutiveFailures} / 5`;
    }
  }

  trigger5FailureStruggleAlert() {
    window.soundSFX.playAlertNotification();

    const alertBox = document.getElementById('struggle-alert-box');
    if (alertBox) alertBox.classList.add('active');

    this.updatePetDialogue("Don't worry! Dr. Ritu was alerted to review our attempts and push a helpful clinical video!");

    const currentStudentId = window.appState?.activeStudentId || 'ORB-4819';
    const studentInfo = (window.appState?.studentsDirectory[currentStudentId]) || {};
    const currentStudentName = studentInfo.name || "Aarav Sharma";

    // Also notify socket server if connected
    if (window.socketClient) {
      window.socketClient.emit('STUDENT_FAILURE_THRESHOLD', {
        studentId: window.appState?.activeStudentDbId || 1,
        phonemeId: this.currentPhoneme?.backendId || 1,
        count: 5,
      });
    }

    const struggleAlertData = {
      id: Date.now(),
      studentId: currentStudentId,
      studentName: currentStudentName,
      age: studentInfo.age ? `${studentInfo.age} yrs` : '6 yrs',
      phonemeId: this.currentPhoneme.id,
      phonemeSymbol: this.currentPhoneme.symbol,
      phonemeName: this.currentPhoneme.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      consecutiveFailures: 5,
      status: 'pending',
      resolved: false,
      deficitReason: `Detected repeated struggle (5 continuous attempts) on '${this.currentPhoneme.symbol}'. Articulatory guidance requested.`,
      recommendedVideoTitle: `${this.currentPhoneme.name} Demonstration (vowel_1.mp4)`,
      videoUrl: 'assets/videos/vowel_1.mp4'
    };

    window.appState.addStruggleAlert(struggleAlertData);

    window.appState.showToast(
      '🚨 5-Failure Struggle Triggered',
      `Therapist alerted: ${currentStudentName} struggled with '${this.currentPhoneme.symbol}'. Added to Clinician Review List!`,
      'alert'
    );

    // Prompt sensory calming regulation break
    setTimeout(() => {
      if (window.RegulationBreak) {
        window.RegulationBreak.startBreak();
      }
    }, 1200);
  }

  hideFeedback() {
    const feedbackCard = document.getElementById('feedback-result-card');
    if (feedbackCard) feedbackCard.classList.remove('active');
  }

  triggerConfetti() {
    const colors = ['#ffd500', '#1e88e5', '#2ecc71', '#e53935', '#8e24aa', '#ff7700'];
    for (let i = 0; i < 28; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = `${50 + (Math.random() - 0.5) * 45}%`;
      confetti.style.top = `${40 + (Math.random() - 0.5) * 25}%`;
      confetti.style.width = `${8 + Math.random() * 8}px`;
      confetti.style.height = `${8 + Math.random() * 8}px`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '99999';
      confetti.style.pointerEvents = 'none';
      confetti.style.transition = 'all 0.9s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(confetti);

      requestAnimationFrame(() => {
        confetti.style.transform = `translate(${(Math.random() - 0.5) * 300}px, ${150 + Math.random() * 220}px) rotate(${Math.random() * 360}deg)`;
        confetti.style.opacity = '0';
      });

      setTimeout(() => confetti.remove(), 1000);
    }
  }
}

window.StudentViewController = StudentViewController;
