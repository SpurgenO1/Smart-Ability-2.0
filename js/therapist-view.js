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
    this.fetchBackendAlerts();
  }

  async fetchBackendAlerts() {
    if (window.apiClient && window.apiClient.isAuthenticated() && window.apiClient.currentUser?.role === 'therapist') {
      try {
        const res = await window.apiClient.getStruggleAlerts('pending');
        const alertList = res?.alerts || (Array.isArray(res) ? res : []);
        if (alertList.length > 0) {
          alertList.forEach(a => {
            const exists = window.appState.struggleAlerts.some(sa => sa.id === a.id);
            if (!exists) {
              window.appState.struggleAlerts.unshift({
                id: a.id,
                studentName: a.studentName || 'Aarav Sharma',
                phonemeId: a.phonemeId || 'ka',
                phonemeSymbol: a.phoneme || 'क',
                phonemeName: `Target (${a.phoneme || 'क'})`,
                timestamp: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                consecutiveFailures: a.failureCount || 5,
                resolved: a.status === 'resolved' || a.status === 'unlocked',
              });
            }
          });
          this.renderStruggleAlerts();
        }
      } catch (err) {
        console.warn('[TherapistView] Backend alerts note:', err.message || err);
      }
    }
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

    // One-Click Push Clinical Demonstration Video to Student Button
    const pushBtn = document.getElementById('btn-push-to-student');
    if (pushBtn) {
      pushBtn.addEventListener('click', () => {
        this.pushCurrentVideoToStudent();
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
      this.initStudioVideo();
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
   * One-Click Video Demonstration Push / Unlock Action
   */
  async resolveAndUnlock3D(alertId, phonemeId) {
    window.soundSFX.playUnlockCheer();

    if (window.apiClient && window.apiClient.isAuthenticated()) {
      try {
        await window.apiClient.unlockContent(alertId, { sendNotification: true });
        console.log('✅ Struggle alert unlocked on backend:', alertId);
      } catch (err) {
        console.warn('[TherapistView] Backend unlock fallback to local:', err.message || err);
      }
    }

    // Mark alert as resolved
    window.appState.resolveAlert(alertId);

    // Unlock video demonstration for student and parent
    window.appState.unlockPhoneme3D(phonemeId);

    // Re-render alerts
    this.renderStruggleAlerts();

    // Update roster status
    const studentItem = this.roster.find(r => r.targetPhoneme === phonemeId);
    if (studentItem) {
      studentItem.status = 'in-progress';
      studentItem.statusLabel = 'Video Guided Active';
      this.renderSchedule();
    }

    // Show toast
    window.appState.showToast(
      '🎬 Clinical Demonstration Unlocked!',
      `Successfully unlocked clinical articulation video for ${studentItem ? studentItem.student : 'student'} and notified parent!`,
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
    const titleEl = document.getElementById('studio-current-phoneme-title');
    const cueEl = document.getElementById('studio-pediatric-cue-text');
    if (titleEl) titleEl.textContent = `${phoneme.symbol} - ${phoneme.name} (${phoneme.ipa || ''})`;
    if (cueEl) cueEl.textContent = phoneme.soundLevel.pediatricCue;

    // Load authentic clinical articulation video into preview player
    const videoPlayer = document.getElementById('studio-demonstration-video');
    if (videoPlayer) {
      let videoSrc = 'assets/videos/asha.mp4';
      if (phoneme.id.includes('swar') || phoneme.category.includes('Vowel')) {
        videoSrc = 'assets/videos/vowel_1.mp4';
      } else if (phoneme.id === 'ka' || phoneme.id === 'kha') {
        videoSrc = 'assets/videos/asha.mp4';
      } else {
        videoSrc = 'assets/videos/krishna.mp4';
      }
      videoPlayer.src = videoSrc;
      videoPlayer.load();
    }

    // Run Root-Cause Diagnostic Clustering
    this.updateStudioDiagnostics(phoneme);
  }

  updateStudioDiagnostics(phoneme) {
    if (!window.RootCauseEngine) return;

    const sampleFingerprint = {
      [phoneme.symbol]: 58,
      'क': 62,
      'ख': 55,
      'ट': 85,
      'प': 90,
    };

    const diag = window.RootCauseEngine.detectRootCause(sampleFingerprint);

    const labelEl = document.getElementById('rc-deficit-label') || document.getElementById('diag-root-cause-label');
    const descEl = document.getElementById('rc-deficit-desc');
    const pillsBox = document.getElementById('rc-affected-pills') || document.getElementById('diag-affected-tags');
    const videoLabelEl = document.getElementById('studio-current-video-label');

    if (labelEl) labelEl.textContent = diag.rootCauseLabel || 'Velar Occlusion & Tongue Back Elevation';
    if (descEl && diag.recommendations && diag.recommendations.length > 0) {
      descEl.textContent = diag.recommendations[0];
    }

    if (pillsBox && diag.affectedPhonemes) {
      pillsBox.innerHTML = '';
      diag.affectedPhonemes.forEach((p) => {
        const span = document.createElement('span');
        span.className = `cluster-pill ${p === phoneme.symbol ? 'failing' : ''}`;
        span.textContent = `${p}`;
        pillsBox.appendChild(span);
      });
    }

    const videoPlayer = document.getElementById('studio-demonstration-video');
    if (videoLabelEl && videoPlayer) {
      videoLabelEl.textContent = videoPlayer.getAttribute('src') || videoPlayer.src;
    }
  }

  initStudioVideo() {
    this.selectPhonemeInStudio(this.selectedPhoneme);
  }

  async pushCurrentVideoToStudent() {
    window.soundSFX.playUnlockCheer();

    let videoUrl = 'assets/videos/asha.mp4';
    if (this.selectedPhoneme.id.includes('swar')) {
      videoUrl = 'assets/videos/vowel_1.mp4';
    }

    if (window.apiClient && window.apiClient.isAuthenticated()) {
      try {
        await window.apiClient.pushSessionContent(1, videoUrl, 'CLINICAL_VIDEO');
      } catch (e) {
        console.warn('[TherapistView] Video push fallback:', e.message || e);
      }
    }

    if (window.socketClient) {
      window.socketClient.emit('CONTENT_PUSHED', {
        phonemeId: this.selectedPhoneme.id,
        contentUrl: videoUrl,
        contentType: 'CLINICAL_VIDEO',
      });
    }

    window.appState.unlockPhoneme3D(this.selectedPhoneme.id);

    window.appState.showToast(
      '📡 Clinical Demonstration Streamed',
      `Authentic video demonstration for '${this.selectedPhoneme.symbol}' pushed to student practice room!`,
      'unlock'
    );
  }
}

window.TherapistViewController = TherapistViewController;
