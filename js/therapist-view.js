/**
 * Smart Articulation Training System - Therapist Portal Controller
 * Schedule Roster, 5-Failure Struggle Alert Center,
 * One-Click 3D Video Push, Live Articulation Studio with 3D Anatomy Sliders
 */

class TherapistViewController {
  constructor() {
    this.activeTab = 'schedule'; // 'schedule', 'demonstrations', or 'studio'
    this.selectedStudent = null;
    this.selectedPhoneme = getPhonemeById('ka');
    this.studioVocalTract = null;
    this.demoFilter = 'all';
    this.demoSearchQuery = '';

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
    this.renderDemonstrationPushList();
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
    const demoView = document.getElementById('therapist-demonstrations-subview');
    const studioView = document.getElementById('therapist-studio-subview');

    if (view === 'schedule') {
      if (scheduleView) scheduleView.style.display = 'block';
      if (demoView) demoView.style.display = 'none';
      if (studioView) studioView.style.display = 'none';
      this.renderSchedule();
      this.renderStruggleAlerts();
    } else if (view === 'demonstrations') {
      if (scheduleView) scheduleView.style.display = 'none';
      if (demoView) demoView.style.display = 'block';
      if (studioView) studioView.style.display = 'none';
      this.renderDemonstrationPushList();
    } else {
      if (scheduleView) scheduleView.style.display = 'none';
      if (demoView) demoView.style.display = 'none';
      if (studioView) studioView.style.display = 'block';
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

    const pendingAlerts = window.appState.struggleAlerts.filter(a => a.status === 'pending' || (!a.resolved && a.status !== 'rejected'));

    if (pendingAlerts.length === 0) {
      drawer.style.display = 'none';
      return;
    }

    drawer.style.display = 'flex';
    const first = pendingAlerts[0];

    drawer.innerHTML = `
      <div class="alert-drawer-left">
        <div class="alert-icon-beacon">⚠️</div>
        <div class="alert-details">
          <h3>
            Automated Struggle Alert Queue (5-Failure Rule)
            <span class="badge-alert">${pendingAlerts.length} PENDING</span>
          </h3>
          <p>
            Student <strong>${first.studentName}</strong> failed 5 consecutive attempts at 
            <strong>'${first.phonemeSymbol}' (${first.phonemeName})</strong>. 
            ${pendingAlerts.length > 1 ? `+${pendingAlerts.length - 1} other student(s) waiting in review queue.` : ''}
          </p>
        </div>
      </div>
      <div class="alert-action-group">
        <button class="btn-duo btn-coral" id="btn-open-demo-queue" onclick="window.therapistController.switchSubView('demonstrations'); window.soundSFX?.playPop();">
          🎬 Review & Push Video (${pendingAlerts.length})
        </button>
        <button class="btn-duo btn-ghost" onclick="window.therapistController.openStudioForPhoneme('${first.phonemeId}')">
          🔬 Open Studio
        </button>
      </div>
    `;
  }

  /**
   * Render the comprehensive 5-Failure Student Struggle List with Approve/Reject actions
   */
  renderDemonstrationPushList(filterStatus = null) {
    if (filterStatus) this.demoFilter = filterStatus;
    const container = document.getElementById('demonstration-students-list');
    if (!container) return;

    const allAlerts = window.appState.struggleAlerts || [];

    // Tally counts
    const failedTotal = allAlerts.length;
    const pendingAlerts = allAlerts.filter(a => a.status === 'pending' || (!a.resolved && a.status !== 'rejected'));
    const approvedAlerts = allAlerts.filter(a => a.status === 'approved');
    const rejectedAlerts = allAlerts.filter(a => a.status === 'rejected');

    // Update metrics UI
    const failedEl = document.getElementById('metric-failed-count');
    const pendingEl = document.getElementById('metric-pending-count');
    const approvedEl = document.getElementById('metric-approved-count');
    const rejectedEl = document.getElementById('metric-rejected-count');
    if (failedEl) failedEl.textContent = failedTotal;
    if (pendingEl) pendingEl.textContent = pendingAlerts.length;
    if (approvedEl) approvedEl.textContent = approvedAlerts.length;
    if (rejectedEl) rejectedEl.textContent = rejectedAlerts.length;

    // Update filter tab pills
    const fAll = document.getElementById('filter-count-all');
    const fPend = document.getElementById('filter-count-pending');
    const fAppr = document.getElementById('filter-count-approved');
    const fRej = document.getElementById('filter-count-rejected');
    if (fAll) fAll.textContent = failedTotal;
    if (fPend) fPend.textContent = pendingAlerts.length;
    if (fAppr) fAppr.textContent = approvedAlerts.length;
    if (fRej) fRej.textContent = rejectedAlerts.length;

    // Update subnav badge
    const subnavBadge = document.getElementById('therapist-demo-push-count');
    if (subnavBadge) {
      subnavBadge.textContent = pendingAlerts.length;
      subnavBadge.style.display = pendingAlerts.length > 0 ? 'inline-flex' : 'none';
    }

    // Filter list
    let filtered = allAlerts;
    if (this.demoFilter === 'pending') {
      filtered = pendingAlerts;
    } else if (this.demoFilter === 'approved') {
      filtered = approvedAlerts;
    } else if (this.demoFilter === 'rejected') {
      filtered = rejectedAlerts;
    }

    if (this.demoSearchQuery) {
      const q = this.demoSearchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        (a.studentName && a.studentName.toLowerCase().includes(q)) ||
        (a.studentId && a.studentId.toLowerCase().includes(q)) ||
        (a.phonemeSymbol && a.phonemeSymbol.includes(q)) ||
        (a.phonemeName && a.phonemeName.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="demo-empty-state">
          <div class="empty-icon">✨</div>
          <h4>No Learners In This View</h4>
          <p>No student struggle cases match this filter. Switch tabs to see all 5-failure cases.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    filtered.forEach(alert => {
      const card = document.createElement('div');
      const isApproved = alert.status === 'approved';
      const isRejected = alert.status === 'rejected';
      const isPending = !isApproved && !isRejected;

      card.className = `demo-student-card ${isApproved ? 'status-approved' : isRejected ? 'status-rejected' : 'status-pending'}`;

      const phonemeObj = getPhonemeById(alert.phonemeId) || { symbol: alert.phonemeSymbol || 'क', name: alert.phonemeName || 'Target' };

      card.innerHTML = `
        <div class="demo-card-header">
          <div class="demo-student-identity">
            <div class="student-avatar-badge">${isApproved ? '🌟' : isRejected ? '📋' : '🧒'}</div>
            <div>
              <div class="demo-student-name">
                ${alert.studentName || 'Aarav Sharma'}
                <span class="demo-student-id">${alert.studentId || 'ORB-4819'}</span>
                <span class="demo-student-age">${alert.age || '6 yrs'}</span>
              </div>
              <div class="demo-student-sub">
                Target Letter: <strong>'${phonemeObj.symbol}' (${phonemeObj.name})</strong> • Detected ${alert.timestamp || 'Today'}
              </div>
            </div>
          </div>

          <div class="demo-status-pill ${isApproved ? 'approved' : isRejected ? 'rejected' : 'pending'}">
            ${isApproved ? '✅ Approved & Pushed' : isRejected ? '❌ Push Rejected' : '⚠️ 5 Failures • Needs Approval'}
          </div>
        </div>

        <div class="demo-card-body">
          <!-- Left: Clinical Struggle Diagnostic Summary -->
          <div class="demo-struggle-summary">
            <div class="struggle-tag-row">
              <span class="struggle-warning-tag">⚠️ 5 / 5 Attempts Failed</span>
              <span class="struggle-deficit-tag">Clinical Articulation Struggle</span>
            </div>
            <p class="struggle-deficit-desc">
              <strong>Articulatory Deficit:</strong> ${alert.deficitReason || `Struggled with tongue posture during 5 consecutive repetitions of '${phonemeObj.symbol}'.`}
            </p>
            ${isApproved ? `
              <div class="approved-isolated-notice">
                <span class="lock-icon">🔒</span>
                <span>Exclusive Access: This demonstration video is unlocked <strong>ONLY for ${alert.studentName}</strong> (${alert.studentId}). Other students cannot view this video.</span>
              </div>
            ` : ''}
            ${isRejected ? `
              <div class="rejected-clinical-notice">
                <span>📋 Clinician Note: ${alert.rejectReason || 'In-person tactile guidance advised. Demonstration video kept locked.'}</span>
              </div>
            ` : ''}
          </div>

          <!-- Right: Video Demonstration Candidate & Actions -->
          <div class="demo-video-action-box">
            <div class="demo-video-preview-header">
              <span>🎬 Demonstration Video:</span>
              <span class="demo-video-filename">${alert.recommendedVideoTitle || 'vowel_1.mp4'}</span>
            </div>

            <!-- Video Player Preview -->
            <div class="demo-video-player-wrapper">
              <video class="demo-card-video" controls playsinline preload="metadata" src="${alert.videoUrl || 'assets/videos/vowel_1.mp4'}"></video>
            </div>

            <div class="demo-action-buttons-row">
              ${isPending ? `
                <button class="btn-demo-action btn-approve" onclick="window.therapistController.approveStudentDemonstration(${alert.id})">
                  ✅ Approve & Push Video
                </button>
                <button class="btn-demo-action btn-reject" onclick="window.therapistController.rejectStudentDemonstration(${alert.id})">
                  ❌ Reject Push
                </button>
                <button class="btn-demo-action btn-studio-link" onclick="window.therapistController.openStudioForPhoneme('${alert.phonemeId}')" title="Preview in Live Studio">
                  🔬 Studio
                </button>
              ` : isApproved ? `
                <button class="btn-demo-action btn-revoke" onclick="window.therapistController.rejectStudentDemonstration(${alert.id}, 'Approval revoked by clinician.')">
                  ↩️ Revoke Video Push
                </button>
                <button class="btn-demo-action btn-studio-link" onclick="window.therapistController.openStudioForPhoneme('${alert.phonemeId}')">
                  🔬 Studio
                </button>
              ` : `
                <button class="btn-demo-action btn-approve" onclick="window.therapistController.approveStudentDemonstration(${alert.id})">
                  ✅ Re-evaluate & Approve Push
                </button>
                <button class="btn-demo-action btn-studio-link" onclick="window.therapistController.openStudioForPhoneme('${alert.phonemeId}')">
                  🔬 Studio
                </button>
              `}
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  /**
   * One-Click Video Demonstration Push / Unlock Action (From schedule drawer or push list)
   */
  async approveStudentDemonstration(alertId, customVideoUrl = '') {
    if (window.apiClient && window.apiClient.isAuthenticated()) {
      try {
        await window.apiClient.unlockContent(alertId, { sendNotification: true });
        console.log('✅ Demonstration video unlocked on backend for alert:', alertId);
      } catch (err) {
        console.warn('[TherapistView] Backend unlock fallback to local:', err.message || err);
      }
    }

    window.appState.approveDemonstrationPush(alertId, customVideoUrl);
    this.renderDemonstrationPushList();
    this.renderStruggleAlerts();
  }

  async rejectStudentDemonstration(alertId, reason = '') {
    const finalReason = reason || prompt("Enter clinical reason for rejecting video demonstration push:", "Requires tactile prompt & live placement guidance in next session.") || "Clinical in-person coaching recommended.";

    if (window.apiClient && window.apiClient.isAuthenticated()) {
      try {
        await window.apiClient.rejectAlert(alertId, { reason: finalReason });
        console.log('✅ Demonstration push rejected on backend for alert:', alertId);
      } catch (err) {
        console.warn('[TherapistView] Backend reject fallback to local:', err.message || err);
      }
    }

    window.appState.rejectDemonstrationPush(alertId, finalReason);
    this.renderDemonstrationPushList();
    this.renderStruggleAlerts();
  }

  setDemoFilter(filter) {
    this.demoFilter = filter;
    document.querySelectorAll('.demo-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.renderDemonstrationPushList();
    window.soundSFX?.playPop();
  }

  handleDemoSearch(query) {
    this.demoSearchQuery = query;
    this.renderDemonstrationPushList();
  }

  resolveAndUnlock3D(alertId, phonemeId) {
    this.approveStudentDemonstration(alertId);
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
