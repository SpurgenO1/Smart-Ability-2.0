/**
 * Smart Articulation Training System - Therapist Portal Controller
 * Schedule Roster, 5-Failure Struggle Alert Center,
 * One-Click 3D Video Push, Live Articulation Studio with 3D Anatomy Sliders
 */

class TherapistViewController {
  constructor() {
    this.activeTab = 'schedule'; // 'schedule' or 'studio'
    this.selectedStudent = null;
    this.selectedPhoneme = getPhonemeById('ka');
    this.studioVocalTract = null;

    // Daily appointments roster
    this.roster = [
      { id: 1, time: "09:30 AM", duration: "45m", student: "Aarav Sharma", age: "6 yrs", targetPhoneme: "ka", status: "struggling", statusLabel: "5-Failure Alert" },
      { id: 2, time: "11:00 AM", duration: "45m", student: "Ananya Patel", age: "7 yrs", targetPhoneme: "ta_retro", status: "in-progress", statusLabel: "In Progress" },
      { id: 3, time: "02:15 PM", duration: "30m", student: "Rohan Verma", age: "5 yrs", targetPhoneme: "sa", status: "upcoming", statusLabel: "Upcoming" },
      { id: 4, time: "04:00 PM", duration: "45m", student: "Priya Singh", age: "8 yrs", targetPhoneme: "ra", status: "upcoming", statusLabel: "Upcoming" }
    ];
  }

  init() {
    this.renderAllotmentBanner();
    this.renderProgressNotification();
    this.renderSchedule();
    this.renderStruggleAlerts();
    this.renderPhonemePalette();
    this.setupEventListeners();
  }

  renderAllotmentBanner() {
    const banner = document.getElementById('therapist-allotment-banner');
    if (!banner) return;

    const allotments = (window.appState && window.appState.therapistAllottedNotifications) || [];
    if (allotments.length === 0) {
      banner.style.display = 'none';
      const hudChip = document.getElementById('therapist-allotment-hud-chip');
      if (hudChip) hudChip.style.display = 'none';
      return;
    }

    const latest = allotments[0];
    banner.innerHTML = `
      <div class="allotment-left">
        <div class="allotment-icon">🎓</div>
        <div>
          <div class="allotment-headline">New Patient Allotted to Your Clinical Caseload!</div>
          <div class="allotment-subtext">
            <strong>${latest.name}</strong> (ID: <code>${latest.id}</code> • Age ${latest.age || '6'}) was newly enrolled and assigned to Dr. Ritu Nair for pediatric articulation management.
          </div>
        </div>
      </div>
      <div class="allotment-actions">
        <button type="button" class="btn-allotment-action" onclick="window.settingsController?.openSettings('report')">
          📋 Review Intake & Speech Goals
        </button>
        <button type="button" class="btn-allotment-dismiss" onclick="window.therapistController?.dismissAllotment('${latest.id}')">
          Dismiss ✕
        </button>
      </div>
    `;
    banner.style.display = 'flex';

    const hudChip = document.getElementById('therapist-allotment-hud-chip');
    const hudCount = document.getElementById('therapist-allotment-count');
    if (hudChip) hudChip.style.display = 'inline-flex';
    if (hudCount) hudCount.textContent = `${allotments.length} New Student${allotments.length > 1 ? 's' : ''} Allotted`;
  }

  dismissAllotment(id) {
    if (window.appState && window.appState.therapistAllottedNotifications) {
      window.appState.therapistAllottedNotifications = window.appState.therapistAllottedNotifications.filter(a => a.id !== id);
    }
    this.renderAllotmentBanner();
  }

  renderProgressNotification() {
    const banner = document.getElementById('therapist-progress-notification-card');
    if (!banner) return;

    banner.innerHTML = `
      <div class="therapist-report-left">
        <div class="therapist-report-icon">📊</div>
        <div>
          <div class="therapist-report-headline">Daily Speech Milestone Reports Generated</div>
          <div class="therapist-report-details">Aarav Sharma completed today's practice session with 84% accuracy. Retroflex /ṭ/ tongue curl showed notable improvements.</div>
        </div>
      </div>
      <button type="button" class="btn-therapist-view-report" onclick="window.settingsController?.openSettings('report')">
        <span>📊</span>
        <span>Open Everyday Report →</span>
      </button>
    `;
    banner.style.display = 'flex';
  }

  setupEventListeners() {
    // Subnav tabs (Schedule vs Live Studio)
    document.querySelectorAll('.therapist-subnav .subnav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchSubView(view);
        window.soundSFX.playPop();
      });
    });

    // Student search input filter
    const searchInput = document.getElementById('therapist-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filterRoster(e.target.value.toLowerCase());
      });
    }

    // 3D Anatomy Clinical Sliders
    const sliders = [
      { id: 'slider-tongue-height', param: 'tongueHeight' },
      { id: 'slider-tongue-adv', param: 'tongueAdvancement' },
      { id: 'slider-tongue-curl', param: 'tongueCurl' },
      { id: 'slider-lip-open', param: 'lipOpen' },
      { id: 'slider-jaw-open', param: 'jawOpen' },
      { id: 'slider-airflow', param: 'airflowRate' }
    ];

    sliders.forEach(({ id, param }) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', (e) => {
          const val = parseFloat(e.target.value);
          const valEl = document.getElementById(`${id}-val`);
          if (valEl) valEl.textContent = val.toFixed(2);
          if (this.studioVocalTract) {
            this.studioVocalTract.setManualKinematics(param, val);
          }
        });
      }
    });

    // Airflow simulation toggles in studio
    const nasalToggle = document.getElementById('toggle-nasal-airflow');
    if (nasalToggle) {
      nasalToggle.addEventListener('change', (e) => {
        if (this.studioVocalTract) {
          this.studioVocalTract.setManualKinematics('velumElevated', !e.target.checked);
        }
      });
    }

    const voicingToggle = document.getElementById('toggle-voicing');
    if (voicingToggle) {
      voicingToggle.addEventListener('change', (e) => {
        if (this.studioVocalTract) {
          this.studioVocalTract.setManualKinematics('isVoiced', e.target.checked);
        }
      });
    }

    // One-Click Push 3D Model to Student Button
    const pushBtn = document.getElementById('btn-push-to-student');
    if (pushBtn) {
      pushBtn.addEventListener('click', () => {
        this.pushCurrent3DToStudent();
      });
    }
  }

  switchSubView(view) {
    this.activeTab = view;
    document.querySelectorAll('.therapist-subnav .subnav-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.view === view);
    });

    const scheduleView = document.getElementById('therapist-schedule-subview');
    const studioView = document.getElementById('therapist-studio-subview');

    if (view === 'schedule') {
      scheduleView.style.display = 'block';
      studioView.style.display = 'none';
      this.renderSchedule();
      this.renderStruggleAlerts();
    } else {
      scheduleView.style.display = 'none';
      studioView.style.display = 'block';
      this.initStudio3D();
    }
  }

  renderSchedule() {
    const list = document.getElementById('therapist-roster-list');
    if (!list) return;

    list.innerHTML = '';
    this.roster.forEach(item => {
      const phoneme = getPhonemeById(item.targetPhoneme);
      const card = document.createElement('div');
      card.className = 'time-slot-card';

      card.innerHTML = `
        <div class="slot-time-col">
          <div class="slot-time-text">${item.time}</div>
          <div class="slot-duration">⏱️ ${item.duration}</div>
        </div>
        <div class="slot-patient-col">
          <div class="patient-avatar">🧒</div>
          <div class="patient-info">
            <h4>${item.student} (${item.age})</h4>
            <p>Target: <strong>${phoneme.symbol} (${phoneme.name})</strong> — ${phoneme.category}</p>
          </div>
        </div>
        <div class="slot-status-col">
          <span class="status-badge ${item.status}">${item.statusLabel}</span>
        </div>
        <div class="slot-actions-col">
          <button class="btn-duo btn-blue btn-sm" onclick="window.therapistController.startLiveSession('${item.student}', '${item.targetPhoneme}')">
            🎥 Start Session
          </button>
        </div>
      `;
      list.appendChild(card);
    });
  }

  filterRoster(query) {
    const list = document.getElementById('therapist-roster-list');
    if (!list) return;

    const cards = list.querySelectorAll('.time-slot-card');
    cards.forEach((card, idx) => {
      const item = this.roster[idx];
      const phoneme = getPhonemeById(item.targetPhoneme);
      const matches = item.student.toLowerCase().includes(query) ||
                      phoneme.name.toLowerCase().includes(query) ||
                      phoneme.symbol.includes(query) ||
                      item.status.includes(query);
      card.style.display = matches ? 'flex' : 'none';
    });
  }

  /**
   * Render Automated Struggle Alert Drawer (5-Failure Rule)
   */
  renderStruggleAlerts() {
    const drawer = document.getElementById('struggle-alert-drawer');
    if (!drawer) return;

    const activeAlerts = window.appState.struggleAlerts.filter(a => !a.resolved);

    if (activeAlerts.length === 0) {
      drawer.style.display = 'none';
      return;
    }

    drawer.style.display = 'flex';
    const alert = activeAlerts[0]; // Most urgent struggle

    drawer.innerHTML = `
      <div class="alert-drawer-left">
        <div class="alert-icon-beacon">⚠️</div>
        <div class="alert-details">
          <h3>
            Automated Struggle Alert (5-Failure Rule)
            <span class="badge-alert">URGENT</span>
          </h3>
          <p>
            Student <strong>${alert.studentName}</strong> failed 5 consecutive attempts at pronouncing 
            target letter <strong>'${alert.phonemeSymbol}' (${alert.phonemeName})</strong> during independent practice.
          </p>
        </div>
      </div>
      <div class="alert-action-group">
        <button class="btn-duo btn-coral" id="btn-one-click-push-3d" onclick="window.therapistController.resolveAndUnlock3D(${alert.id}, '${alert.phonemeId}')">
          🔓 One-Click 3D Push / Unlock
        </button>
        <button class="btn-duo btn-ghost" onclick="window.therapistController.openStudioForPhoneme('${alert.phonemeId}')">
          🔬 Open Studio
        </button>
      </div>
    `;
  }

  /**
   * One-Click 3D Video Push / Unlock Action
   */
  resolveAndUnlock3D(alertId, phonemeId) {
    window.soundSFX.playUnlockCheer();

    // Mark alert as resolved
    window.appState.resolveAlert(alertId);

    // Unlock 3D model for student and parent
    window.appState.unlockPhoneme3D(phonemeId);

    // Re-render alerts
    this.renderStruggleAlerts();

    // Update roster status
    const studentItem = this.roster.find(r => r.targetPhoneme === phonemeId);
    if (studentItem) {
      studentItem.status = 'in-progress';
      studentItem.statusLabel = '3D Guided Active';
      this.renderSchedule();
    }

    // Show toast
    window.appState.showToast(
      '🎬 3D Guided Module Unlocked!',
      `Successfully pushed 3D vocal tract & airflow visualizer to ${studentItem ? studentItem.student : 'student'} and notified parent!`,
      'unlock'
    );
  }

  startLiveSession(studentName, phonemeId) {
    window.soundSFX.playPop();
    this.selectedStudent = studentName;
    this.selectedPhoneme = getPhonemeById(phonemeId);

    this.switchSubView('studio');
    window.appState.showToast(
      '📡 Live Session Connected',
      `Live Articulation Studio opened with ${studentName} for target '${this.selectedPhoneme.symbol}'.`,
      'standard'
    );
  }

  openStudioForPhoneme(phonemeId) {
    this.selectedPhoneme = getPhonemeById(phonemeId);
    this.switchSubView('studio');
  }

  renderPhonemePalette() {
    const container = document.getElementById('therapist-phoneme-palette');
    if (!container) return;

    const all = getAllPhonemes('all');
    const categories = [
      { id: 'sparsh', title: 'Sparsh (Stops / स्पर्श)' },
      { id: 'anthastha', title: 'Anthastha (Approximants / अन्तःस्थ)' },
      { id: 'ushma', title: 'Ushma (Fricatives / ऊष्म)' },
      { id: 'english', title: 'English Speech Targets' }
    ];

    container.innerHTML = '';

    categories.forEach(cat => {
      const groupEl = document.createElement('div');
      groupEl.className = 'palette-group';

      const titleEl = document.createElement('div');
      titleEl.className = 'palette-group-title';
      titleEl.innerHTML = `<span>${cat.title}</span>`;
      groupEl.appendChild(titleEl);

      const gridEl = document.createElement('div');
      gridEl.className = 'palette-btn-grid';

      let phonemesInCat = [];
      if (cat.id === 'sparsh') phonemesInCat = all.filter(p => p.category.includes('Sparsh'));
      else if (cat.id === 'anthastha') phonemesInCat = all.filter(p => p.category.includes('Anthastha'));
      else if (cat.id === 'ushma') phonemesInCat = all.filter(p => p.category.includes('Ushma'));
      else phonemesInCat = all.filter(p => p.category.includes('English') || p.category.includes('Approximant') || p.category.includes('Interdental'));

      phonemesInCat.forEach(p => {
        const btn = document.createElement('button');
        btn.className = `palette-phoneme-btn ${p.id === this.selectedPhoneme.id ? 'active' : ''}`;
        btn.textContent = p.symbol;
        btn.title = `${p.name} - ${p.category}`;

        btn.addEventListener('click', () => {
          document.querySelectorAll('.palette-phoneme-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectPhonemeInStudio(p);
          window.soundSFX.playPop();
        });

        gridEl.appendChild(btn);
      });

      groupEl.appendChild(gridEl);
      container.appendChild(groupEl);
    });
  }

  selectPhonemeInStudio(phoneme) {
    this.selectedPhoneme = phoneme;
    if (this.studioVocalTract) {
      this.studioVocalTract.setPhoneme(phoneme);
    }
    this.syncSlidersFromPhoneme(phoneme);
    document.getElementById('studio-current-phoneme-title').textContent = `${phoneme.symbol} - ${phoneme.name} (${phoneme.ipa})`;
    document.getElementById('studio-pediatric-cue-text').textContent = phoneme.soundLevel.pediatricCue;
  }

  syncSlidersFromPhoneme(p) {
    const sl = p.soundLevel;
    const tp = sl.tonguePosition;
    const lp = sl.lipPosition;
    const jp = sl.jawPosition;

    const setSlider = (id, val) => {
      const input = document.getElementById(id);
      const span = document.getElementById(`${id}-val`);
      if (input) input.value = val;
      if (span) span.textContent = val.toFixed(2);
    };

    setSlider('slider-tongue-height', tp.height);
    setSlider('slider-tongue-adv', tp.advancement);
    setSlider('slider-tongue-curl', tp.curl);
    setSlider('slider-lip-open', lp.open);
    setSlider('slider-jaw-open', jp.open);
    setSlider('slider-airflow', 1.0);

    const nasalCheck = document.getElementById('toggle-nasal-airflow');
    if (nasalCheck) nasalCheck.checked = p.id.includes('na') || p.id.includes('ma');

    const voiceCheck = document.getElementById('toggle-voicing');
    if (voiceCheck) voiceCheck.checked = p.category.includes('Voiced') || p.category.includes('Anthastha');
  }

  initStudio3D() {
    if (!this.studioVocalTract) {
      this.studioVocalTract = new VocalTract3DViewer('webgl-therapist-studio', {
        initialPhonemeId: this.selectedPhoneme.id,
        cameraView: 'sagittal'
      });
    }
    this.selectPhonemeInStudio(this.selectedPhoneme);
  }

  pushCurrent3DToStudent() {
    window.soundSFX.playUnlockCheer();
    window.appState.unlockPhoneme3D(this.selectedPhoneme.id);

    window.appState.showToast(
      '📡 3D Stream Pushed to Student',
      `Active 3D vocal tract configuration for '${this.selectedPhoneme.symbol}' pushed to student practice room and parent app!`,
      'unlock'
    );
  }
}

window.TherapistViewController = TherapistViewController;
