/**
 * Smart Articulation Training System - Settings & Everyday Report Controller
 * Manages universal slide-out settings drawer, avatar customizer,
 * everyday student progress report (for therapist & parent),
 * audio cadence speeds, theme modes, and accessibility toggles.
 */

class SettingsController {
  constructor() {
    this.currentTab = 'profile';
    this.selectedReportDate = 'today';
    this.selectedStudentId = 'ORB-4819';

    // Role-specific avatar catalogs
    this.avatarOptions = {
      student: [
        { id: 'boy_explorer', icon: '👦', name: 'Boy Explorer' },
        { id: 'girl_explorer', icon: '👧', name: 'Girl Explorer' },
        { id: 'leo_lion', icon: '🦁', name: 'Brave Lion' },
        { id: 'felix_fox', icon: '🦊', name: 'Clever Fox' },
        { id: 'mimi_cat', icon: '🐱', name: 'Mimi Kitty' },
        { id: 'pip_bunny', icon: '🐰', name: 'Pip Bunny' },
        { id: 'buster_pup', icon: '🐶', name: 'Buster Pup' },
        { id: 'astro_kid', icon: '🚀', name: 'Astro Cadet' }
      ],
      therapist: [
        { id: 'slp_dr_ritu', icon: '🩺', name: 'Dr. Ritu Nair' },
        { id: 'slp_female', icon: '👩‍⚕️', name: 'Senior SLP' },
        { id: 'slp_male', icon: '👨‍⚕️', name: 'Clinical Fellow' },
        { id: 'scientist', icon: '🔬', name: 'Voice Scientist' }
      ],
      parent: [
        { id: 'mom_coach', icon: '👩‍👧', name: 'Mom Coach' },
        { id: 'dad_coach', icon: '👨‍👦', name: 'Dad Coach' },
        { id: 'grandma', icon: '👵', name: 'Grandma' },
        { id: 'grandpa', icon: '👴', name: 'Grandpa' }
      ]
    };

    // Rich daily reports data
    this.dailyReportsData = {
      'ORB-4819': {
        studentName: 'Aarav Sharma',
        today: {
          dateStr: 'Today • Friday, Sep 11, 2026',
          shortDate: 'Sep 11 (Today)',
          minutesPracticed: 24,
          accuracyRate: '89%',
          masteredCountToday: 2,
          masteredList: ['अ', 'आ'],
          struggleAlerts: 1,
          phonemes: [
            { symbol: 'अ', name: 'A (Swar)', group: 'Swar', accuracy: '96%', status: 'mastered', trials: 12 },
            { symbol: 'आ', name: 'Aa (Swar)', group: 'Swar', accuracy: '92%', status: 'mastered', trials: 14 },
            { symbol: 'क', name: 'Ka (Kavarga)', group: 'Kavarga', accuracy: '82%', status: 'practicing', trials: 10 }
          ],
          emotionTheme: 'Joy & Focused Drive',
          clinicianNote: "Aarav demonstrated rapid mastery of Hindi open vowels 'अ' and 'आ' with clean oral exhalation. Recommended 5 minutes of 'आम' (Aam) repetition at dinner.",
          parentActionTip: "Practice the wide 'doctor check-up' mouth shape when naming fruits with Aarav this evening!"
        },
        yesterday: {
          dateStr: 'Yesterday • Thursday, Sep 10, 2026',
          shortDate: 'Sep 10 (Yesterday)',
          minutesPracticed: 20,
          accuracyRate: '86%',
          masteredCountToday: 1,
          masteredList: ['म'],
          struggleAlerts: 0,
          phonemes: [
            { symbol: 'म', name: 'Ma (Pavarga)', group: 'Pavarga', accuracy: '94%', status: 'mastered', trials: 10 },
            { symbol: 'प', name: 'Pa (Pavarga)', group: 'Pavarga', accuracy: '88%', status: 'practicing', trials: 8 }
          ],
          emotionTheme: 'Curiosity & Calm',
          clinicianNote: "Excellent bilabial closure on 'म' (Ma) with Pip Bunny cadence reinforcement.",
          parentActionTip: "Praise Aarav for steady lip-seal closure during snack time."
        },
        prev: {
          dateStr: 'Wednesday, Sep 09, 2026',
          shortDate: 'Sep 09',
          minutesPracticed: 18,
          accuracyRate: '82%',
          masteredCountToday: 1,
          masteredList: ['प'],
          struggleAlerts: 0,
          phonemes: [
            { symbol: 'प', name: 'Pa (Pavarga)', group: 'Pavarga', accuracy: '90%', status: 'mastered', trials: 12 }
          ],
          emotionTheme: 'Enthusiastic',
          clinicianNote: "Initial bilabial plosive 'प' established with mirror feedback.",
          parentActionTip: "Great start to the week with bilabial consonants."
        }
      },
      'ORB-7320': {
        studentName: 'Ananya Verma',
        today: {
          dateStr: 'Today • Friday, Sep 11, 2026',
          shortDate: 'Sep 11 (Today)',
          minutesPracticed: 26,
          accuracyRate: '92%',
          masteredCountToday: 3,
          masteredList: ['इ', 'ई', 'त'],
          struggleAlerts: 0,
          phonemes: [
            { symbol: 'इ', name: 'I (Swar)', group: 'Swar', accuracy: '95%', status: 'mastered', trials: 10 },
            { symbol: 'ई', name: 'Ee (Swar)', group: 'Swar', accuracy: '94%', status: 'mastered', trials: 12 },
            { symbol: 'त', name: 'Ta (Dental)', group: 'Tavarga', accuracy: '88%', status: 'mastered', trials: 8 }
          ],
          emotionTheme: 'Confident & Joyful',
          clinicianNote: "Superb front vowel spread. Ananya completed both short and long /i/ phonemes.",
          parentActionTip: "Play sound games finding objects starting with 'इ' (Imli)."
        },
        yesterday: {
          dateStr: 'Yesterday • Thursday, Sep 10, 2026',
          shortDate: 'Sep 10',
          minutesPracticed: 22,
          accuracyRate: '88%',
          masteredCountToday: 1,
          masteredList: ['ल'],
          struggleAlerts: 0,
          phonemes: [
            { symbol: 'ल', name: 'La (Anthastha)', group: 'Anthastha', accuracy: '91%', status: 'mastered', trials: 10 }
          ],
          emotionTheme: 'Focused',
          clinicianNote: "Alveolar lateral approximant 'ल' articulatory placement stabilized.",
          parentActionTip: "Encourage light tongue tip taps on upper gum ridge."
        }
      }
    };
  }

  init() {
    this.setupEventListeners();
    this.applyInitialSettings();
    console.log("Settings & Everyday Report Controller initialized.");
  }

  setupEventListeners() {
    // Open Settings Buttons
    const openBtns = [
      document.getElementById('btn-header-settings'),
      document.getElementById('btn-floating-settings')
    ];
    openBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          // Open to Report tab automatically if in therapist or parent role, else profile
          const role = window.appState ? window.appState.currentRole : 'student';
          const defaultTab = (role === 'therapist' || role === 'parent') ? 'report' : 'profile';
          this.openSettings(defaultTab);
        });
      }
    });

    // Close Button & Backdrop
    const closeBtn = document.getElementById('btn-close-settings');
    const backdrop = document.getElementById('settings-drawer-backdrop');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeSettings());
    if (backdrop) backdrop.addEventListener('click', () => this.closeSettings());

    // ESC key closes drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeSettings();
    });

    // Tab Navigation Buttons inside drawer
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tabId = e.currentTarget.dataset.tab;
        this.selectTab(tabId);
        if (window.soundSFX) window.soundSFX.playPop();
      });
    });

    // Everyday Report Date Pills
    document.querySelectorAll('.report-date-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.report-date-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.selectedReportDate = e.currentTarget.dataset.date;
        this.renderEverydayReport();
        if (window.soundSFX) window.soundSFX.playPop();
      });
    });

    // Everyday Report Student Selector (for Therapist)
    const studentSelect = document.getElementById('report-student-select');
    if (studentSelect) {
      studentSelect.addEventListener('change', (e) => {
        this.selectedStudentId = e.target.value;
        this.renderEverydayReport();
        if (window.soundSFX) window.soundSFX.playPop();
      });
    }

    // Print & Export Report Buttons
    const printBtn = document.getElementById('btn-print-daily-report');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const exportBtn = document.getElementById('btn-export-daily-pdf');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportDailyReport();
      });
    }

    // Audio Settings Controls
    document.querySelectorAll('.btn-cadence-speed').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-cadence-speed').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const speed = parseFloat(e.currentTarget.dataset.speed);
        if (window.speechEngine) {
          window.speechEngine.rate = speed;
        }
        if (window.soundSFX) window.soundSFX.playPop();
      });
    });

    const sfxToggle = document.getElementById('toggle-sfx');
    if (sfxToggle) {
      sfxToggle.addEventListener('change', (e) => {
        if (window.soundSFX) window.soundSFX.enabled = e.target.checked;
      });
    }

    // Theme Options
    document.querySelectorAll('.theme-option-card').forEach(card => {
      card.addEventListener('click', (e) => {
        document.querySelectorAll('.theme-option-card').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const theme = e.currentTarget.dataset.theme;
        this.setTheme(theme);
        if (window.soundSFX) window.soundSFX.playPop();
      });
    });

    // Dyslexia Font Toggle
    const fontToggle = document.getElementById('toggle-dyslexia-font');
    if (fontToggle) {
      fontToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dyslexia-font', e.target.checked);
      });
    }

    // Reduced Motion Toggle
    const motionToggle = document.getElementById('toggle-reduced-motion');
    if (motionToggle) {
      motionToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('reduced-motion', e.target.checked);
      });
    }
  }

  openSettings(tabName = 'profile') {
    const drawer = document.getElementById('settings-side-panel');
    const backdrop = document.getElementById('settings-drawer-backdrop');
    if (!drawer || !backdrop) return;

    drawer.classList.add('active');
    backdrop.classList.add('active');

    this.selectTab(tabName);
    this.renderUserProfileAndAvatars();
    this.renderEverydayReport();

    if (window.soundSFX) window.soundSFX.playPop();
  }

  closeSettings() {
    const drawer = document.getElementById('settings-side-panel');
    const backdrop = document.getElementById('settings-drawer-backdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    if (window.soundSFX) window.soundSFX.playPop();
  }

  selectTab(tabId) {
    this.currentTab = tabId;

    // Update tab buttons
    document.querySelectorAll('.settings-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update tab panels
    document.querySelectorAll('.settings-tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-content-${tabId}`);
    });
  }

  renderUserProfileAndAvatars() {
    const role = window.appState ? window.appState.currentRole : 'student';
    const activeAvatar = (window.appState && window.appState.userAvatar) ? window.appState.userAvatar : (role === 'therapist' ? '🩺' : role === 'parent' ? '👩‍👧' : '👦');

    // Update Profile Card
    const avatarPreview = document.getElementById('settings-current-avatar');
    const userNameEl = document.getElementById('settings-user-name');
    const userRoleEl = document.getElementById('settings-user-role');
    const userIdEl = document.getElementById('settings-user-id');

    if (avatarPreview) avatarPreview.textContent = activeAvatar;

    if (userNameEl) {
      if (role === 'therapist') userNameEl.textContent = "Dr. Ritu Nair (SLP)";
      else if (role === 'parent') userNameEl.textContent = "Parent / Guardian";
      else userNameEl.textContent = (window.appState && window.appState.studentsDirectory[window.appState.activeStudentId]) ? window.appState.studentsDirectory[window.appState.activeStudentId].name : "Aarav Sharma";
    }

    if (userRoleEl) {
      if (role === 'therapist') userRoleEl.textContent = "🩺 Licensed Speech Pathologist";
      else if (role === 'parent') userRoleEl.textContent = "👨‍👩‍👦 Caregiver & Home Coach";
      else userRoleEl.textContent = "🌟 Student Explorer";
    }

    if (userIdEl) {
      if (role === 'student') userIdEl.textContent = `ID: ${window.appState.activeStudentId || 'ORB-4819'}`;
      else if (role === 'therapist') userIdEl.textContent = `Clinical Lic: #SLP-MH-9412`;
      else {
        const activeName = (window.appState && window.appState.studentsDirectory[window.appState.linkedChildId]) ? window.appState.studentsDirectory[window.appState.linkedChildId].name : 'Aarav Sharma';
        userIdEl.textContent = `Active Child: ${activeName} (${window.appState.linkedChildId || 'ORB-4819'})`;
      }
    }

    // Render Avatar Choices Grid based on role
    const grid = document.getElementById('avatar-selection-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const catalog = this.avatarOptions[role] || this.avatarOptions.student;

    catalog.forEach(item => {
      const card = document.createElement('div');
      card.className = `avatar-choice-card ${activeAvatar === item.icon ? 'active' : ''}`;
      card.innerHTML = `
        <div class="avatar-choice-icon">${item.icon}</div>
        <div class="avatar-choice-name">${item.name}</div>
      `;

      card.addEventListener('click', () => {
        this.selectAvatar(item.icon);
      });

      grid.appendChild(card);
    });
  }

  selectAvatar(icon) {
    if (window.appState) {
      window.appState.userAvatar = icon;
      // Also update role HUD if relevant
      this.updateHeaderAvatarBadge(icon);
      window.appState.showToast('✨ Avatar Updated!', `Character avatar updated to ${icon}!`, 'standard');
    }

    this.renderUserProfileAndAvatars();
    if (window.soundSFX) window.soundSFX.playCorrect();
  }

  updateHeaderAvatarBadge(icon) {
    const avatarPreview = document.getElementById('settings-current-avatar');
    if (avatarPreview) avatarPreview.textContent = icon;

    // If there is an avatar badge on the header button, update it
    const headerAvatar = document.getElementById('header-user-avatar-badge');
    if (headerAvatar) headerAvatar.textContent = icon;
  }

  /**
   * The button previously just showed a success toast without producing any
   * file - actually build and download a real, self-contained printable HTML
   * report from the same data renderEverydayReport() displays on screen, so
   * "Download Summary PDF" isn't a no-op. (It's an .html file the browser's
   * own print dialog can turn into a PDF via "Save as PDF" - that's what
   * window.print() above already does for the on-screen view; this gives
   * the user something they can actually save/attach/forward.)
   */
  exportDailyReport() {
    const role = window.appState ? window.appState.currentRole : 'student';
    const studentData = this.dailyReportsData[this.selectedStudentId] || this.dailyReportsData['ORB-4819'];
    const reportDate = studentData[this.selectedReportDate] || studentData.today;

    const phonemeRows = reportDate.phonemes
      .map(
        (p) => `<tr>
          <td>${p.symbol} ${p.name}</td>
          <td>${p.accuracy}</td>
          <td>${p.trials}</td>
          <td>${p.status === 'mastered' ? '⭐ Mastered' : 'In Progress'}</td>
        </tr>`
      )
      .join('');

    const noteLabel = role === 'therapist' ? 'Clinical Articulation Note' : 'Caregiver Home Practice Recommendation';
    const noteBody = role === 'therapist' ? reportDate.clinicianNote : reportDate.parentActionTip;

    const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>EchoSeed Daily Summary - ${reportDate.dateStr}</title>
<style>
  body { font-family: Arial, sans-serif; color: #0f172a; padding: 32px; max-width: 720px; margin: 0 auto; }
  h1 { font-size: 20px; margin-bottom: 4px; }
  .subtitle { color: #64748b; margin-bottom: 24px; }
  .metrics { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
  .metric { border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 16px; }
  .metric-label { font-size: 11px; text-transform: uppercase; color: #94a3b8; }
  .metric-value { font-size: 16px; font-weight: 800; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
  .note-box { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px; padding: 16px; }
</style></head>
<body>
  <h1>EchoSeed Daily Practice Summary</h1>
  <div class="subtitle">${reportDate.dateStr}</div>
  <div class="metrics">
    <div class="metric"><div class="metric-label">Minutes Practiced</div><div class="metric-value">${reportDate.minutesPracticed} mins</div></div>
    <div class="metric"><div class="metric-label">Accuracy Rate</div><div class="metric-value">${reportDate.accuracyRate}</div></div>
    <div class="metric"><div class="metric-label">Sounds Mastered Today</div><div class="metric-value">${reportDate.masteredCountToday}</div></div>
    <div class="metric"><div class="metric-label">Emotion</div><div class="metric-value">${reportDate.emotionTheme}</div></div>
  </div>
  <table>
    <thead><tr><th>Phoneme</th><th>Accuracy</th><th>Trials</th><th>Status</th></tr></thead>
    <tbody>${phonemeRows}</tbody>
  </table>
  <div class="note-box"><strong>${noteLabel}:</strong><br>${noteBody}</div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `echoseed-summary-${this.selectedReportDate || 'today'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    if (window.appState) {
      window.appState.showToast('📄 Daily Report Exported', 'Summary downloaded - open it and use your browser\'s "Print > Save as PDF" for a PDF copy.', 'unlock');
    }
    if (window.soundSFX) window.soundSFX.playCorrect();
  }

  renderEverydayReport() {
    const role = window.appState ? window.appState.currentRole : 'student';
    if (role === 'parent' && window.appState && window.appState.linkedChildId) {
      this.selectedStudentId = window.appState.linkedChildId;
    }
    const studentData = this.dailyReportsData[this.selectedStudentId] || this.dailyReportsData['ORB-4819'];
    const reportDate = studentData[this.selectedReportDate] || studentData.today;

    // Update Date Header
    const dateLabel = document.getElementById('report-current-date-label');
    if (dateLabel) dateLabel.textContent = reportDate.dateStr;

    // Show/Hide Student Selector based on Role
    const studentSelectContainer = document.getElementById('report-student-selector-box');
    if (studentSelectContainer) {
      studentSelectContainer.style.display = (role === 'therapist') ? 'block' : 'none';
    }

    // Update Metrics
    const minutesEl = document.getElementById('metric-practice-minutes');
    if (minutesEl) minutesEl.textContent = `${reportDate.minutesPracticed} mins`;

    const accuracyEl = document.getElementById('metric-accuracy-rate');
    if (accuracyEl) accuracyEl.textContent = reportDate.accuracyRate;

    const masteredCountEl = document.getElementById('metric-mastered-today');
    if (masteredCountEl) masteredCountEl.textContent = `${reportDate.masteredCountToday} Sounds ⭐`;

    const emotionEl = document.getElementById('metric-emotion-state');
    if (emotionEl) emotionEl.textContent = reportDate.emotionTheme;

    // Render Practiced Phonemes List
    const phonemeList = document.getElementById('daily-practiced-phonemes-list');
    if (phonemeList) {
      phonemeList.innerHTML = '';
      reportDate.phonemes.forEach(p => {
        const chip = document.createElement('div');
        chip.className = `daily-phoneme-chip ${p.status}`;
        chip.innerHTML = `
          <span class="daily-phoneme-symbol">${p.symbol}</span>
          <span style="font-size: 11.5px; font-weight: 800; color: #475569;">${p.name}</span>
          <span class="daily-phoneme-score" style="color: ${p.status === 'mastered' ? '#15803d' : '#0369a1'};">
            ${p.accuracy} (${p.trials} trials)
          </span>
          ${p.status === 'mastered' ? '<span>⭐</span>' : ''}
        `;
        phonemeList.appendChild(chip);
      });
    }

    // Role-Adaptive Note
    const noteTitle = document.getElementById('daily-note-title');
    const noteBody = document.getElementById('daily-note-body');
    if (noteTitle && noteBody) {
      if (role === 'therapist') {
        noteTitle.innerHTML = '<span>🩺</span> Clinical Articulation Note';
        noteBody.textContent = reportDate.clinicianNote;
      } else {
        noteTitle.innerHTML = '<span>💡</span> Caregiver Home Practice Recommendation';
        noteBody.textContent = reportDate.parentActionTip;
      }
    }
  }

  setTheme(themeName) {
    document.body.classList.remove('theme-sky', 'theme-twilight', 'theme-high-contrast');
    if (themeName === 'twilight') {
      document.body.classList.add('theme-twilight');
    } else if (themeName === 'contrast') {
      document.body.classList.add('theme-high-contrast');
    }
    // Default is sky
  }

  applyInitialSettings() {
    // Defaults
    if (window.speechEngine) {
      window.speechEngine.rate = 1.0;
    }
  }
}

window.settingsController = new SettingsController();
