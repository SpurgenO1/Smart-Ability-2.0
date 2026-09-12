/**
 * Smart Articulation Training System - Parent Portal Controller
 * Speech Trajectory Analytics, 30-Day Heatmap Calendar,
 * Telepractice Appointments & Clinician Check-Ins,
 * Unlocked 3D Practice Launcher, Therapist Clinical Notes Feed,
 * and Unique Child ID Pairing.
 */

class ParentViewController {
  constructor() {
    this.currentChildId = 'ORB-4819';
    this.childData = null;
  }

  init() {
    this.loadChildData();
    this.renderAll();
    this.setupEventListeners();
  }

  loadChildData() {
    if (window.appState && window.appState.studentsDirectory) {
      this.childData = window.appState.studentsDirectory[this.currentChildId] || window.appState.getDefaultChildData();
    } else {
      this.childData = {
        id: 'ORB-4819',
        name: 'Aarav Sharma',
        age: '6 years',
        program: 'Pediatric Speech Retraining',
        masteredCount: '13 / 18',
        masteredSubtext: '↑ 3 sounds mastered this week',
        streak: 12,
        streakSubtext: 'Consistent home practice',
        clinician: 'Dr. Ritu Nair (SLP)',
        clinicianSubtext: 'SLP • Next Session Today 09:30 AM',
        progressGroups: [
          { name: "Swar (Vowels / स्वर - अ to अः: 13 Sounds)", mastered: "12 / 13", percent: 92, color: "blue" },
          { name: "Sparsh (Stops / स्पर्श - क to म: 25 Letters)", mastered: "18 / 25", percent: 72, color: "green" },
          { name: "Anthastha (Approximants / अन्तःस्थ - य, र, ल, व)", mastered: "3 / 4", percent: 75, color: "blue" },
          { name: "Ushma & Glottal (ऊष्म व कण्ठ्य - श, ष, स, ह)", mastered: "3 / 4", percent: 75, color: "coral" },
          { name: "Samyukt Blends (संयुक्ताक्षर - क्ष, त्र, ज्ञ, श्र)", mastered: "2 / 4", percent: 50, color: "green" }
        ],
        appointments: [
          {
            title: "Weekly Telepractice Video Session",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Today at 09:30 AM",
            status: "Upcoming",
            isToday: true,
            notes: "Focusing on velar stop /k/ and posterior tongue retraction"
          },
          {
            title: "Bi-Weekly Clinical Articulation Review",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Friday, Sep 18 • 04:00 PM",
            status: "Scheduled",
            isToday: false,
            notes: "Reviewing retroflex /ṭ/ tongue-curling accuracy"
          },
          {
            title: "Caregiver Articulation Coaching Check-In",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Sep 04 • Completed",
            status: "Completed",
            isToday: false,
            notes: "Coached parent on 3D tongue visualizer home prompts"
          }
        ],
        notes: [
          {
            date: "Today, 10:15 AM",
            therapist: "Dr. Ritu Nair (Speech Language Pathologist)",
            target: "Target: 'क' (Ka - Velar Stop)",
            content: "Observed Aarav struggling with posterior tongue elevation (velar fronting: substituting 'त' for 'क'). I have unlocked the 3D anatomical video module. Please have Aarav watch the dragon puff airflow simulation before his next 5 practice reps."
          },
          {
            date: "Yesterday, 04:30 PM",
            therapist: "Dr. Ritu Nair (Speech Language Pathologist)",
            target: "Target: 'ट' (Ṭa - Retroflex Stop)",
            content: "Aarav showed excellent progress with tongue tip retroflex curling! His accuracy jumped to 92% on tomato ('टमाटर'). Keep celebrating his wins with positive reinforcement."
          }
        ]
      };
    }
  }

  renderAll() {
    this.renderChildrenSelector();
    this.renderProgressNotification();
    this.renderOverviewMetrics();
    this.renderAppointments();
    this.renderAlertBanner();
    this.renderProgressBars();
    this.renderHeatmapCalendar();
    this.renderTherapistNotes();
  }

  renderProgressNotification() {
    const banner = document.getElementById('parent-progress-notification-card');
    if (!banner) return;
    const child = this.childData || (window.appState && window.appState.getDefaultChildData()) || { name: 'Aarav Sharma' };
    const firstName = child.name ? child.name.split(' ')[0] : 'Learner';
    
    banner.innerHTML = `
      <div class="progress-notify-left">
        <div class="notify-icon-glow">📊</div>
        <div>
          <div class="notify-headline">🌟 Today's Speech Progress Report Ready for ${child.name}!</div>
          <div class="notify-details">${firstName} completed 18 mins of home practice today with 84% accuracy on Velar & Retroflex stops. Dr. Ritu's daily notes are ready.</div>
        </div>
      </div>
      <button type="button" class="btn-view-report-now" onclick="window.settingsController?.openSettings('report')">
        <span>📊</span>
        <span>View Everyday Report →</span>
      </button>
    `;
    banner.style.display = 'flex';
  }

  renderChildrenSelector() {
    const list = document.getElementById('parent-children-chips-list');
    if (!list) return;

    list.innerHTML = '';
    const linkedIds = (window.appState && window.appState.linkedChildrenIds) || [this.currentChildId];
    const directory = (window.appState && window.appState.studentsDirectory) || {};

    // Update count badge if present
    const countBadge = document.getElementById('hub-children-count-badge');
    if (countBadge) {
      countBadge.textContent = `${linkedIds.length} ${linkedIds.length === 1 ? 'Learner' : 'Learners'}`;
    }

    linkedIds.forEach(id => {
      const child = directory[id] || { id, name: `Learner (${id})`, age: '6', program: 'Speech Articulation Practice' };
      const isActive = child.id === this.currentChildId;
      const firstName = child.name ? child.name.split(' ')[0] : 'Learner';
      const isBoy = id === 'ORB-4819' || (!child.name.toLowerCase().includes('ananya') && !child.name.toLowerCase().includes('priya'));
      const avatarEmoji = isBoy ? '👦' : '👧';

      const childCard = document.createElement('div');
      childCard.className = `child-passport-card ${isActive ? 'active' : ''}`;
      childCard.title = isActive ? `${child.name} is currently selected` : `Click to view ${child.name}'s therapy dashboard`;
      
      childCard.innerHTML = `
        <div class="passport-card-header">
          <div class="passport-avatar-wrapper">
            <div class="passport-avatar-circle">${avatarEmoji}</div>
            ${isActive ? '<span class="active-pulse-dot" title="Currently Active Profile"></span>' : ''}
          </div>
          <div class="passport-identity-block">
            <div class="passport-name-row">
              <h4 class="passport-child-name">${child.name}</h4>
              ${isActive ? '<span class="status-badge-active"><span class="dot">●</span> Active</span>' : '<span class="status-badge-idle">Linked</span>'}
            </div>
            <div class="passport-id-row">
              <span class="id-pill">🆔 ${child.id}</span>
              <span class="age-pill">🎂 Age ${child.age || '6'}</span>
            </div>
          </div>
        </div>

        <div class="passport-program-line">
          <span>🎯</span>
          <span>${child.program || 'Pediatric Speech Retraining'}</span>
        </div>

        <div class="passport-stats-grid">
          <div class="passport-stat-box">
            <span class="stat-mini-label">Sounds</span>
            <span class="stat-mini-val text-green">${child.masteredCount || '13 / 18'}</span>
          </div>
          <div class="passport-stat-box">
            <span class="stat-mini-label">Streak</span>
            <span class="stat-mini-val text-orange">🔥 ${child.streak || 12}d</span>
          </div>
          <div class="passport-stat-box">
            <span class="stat-mini-label">Clinician</span>
            <span class="stat-mini-val text-blue">Dr. Ritu</span>
          </div>
        </div>

        <div class="passport-action-bar">
          ${isActive 
            ? `<div class="passport-active-indicator">
                 <span>✅</span>
                 <span>Currently Viewing</span>
               </div>`
            : `<button type="button" class="btn-switch-to-child">
                 <span>🔄</span>
                 <span>Switch to ${firstName}</span>
               </button>`
          }
        </div>
      `;

      childCard.addEventListener('click', () => {
        if (!isActive && window.appState) {
          window.appState.switchLinkedChild(child.id);
          if (window.soundSFX) window.soundSFX.playPop();
        }
      });

      list.appendChild(childCard);
    });

    // Append the interactive '+ Add Child Acc' passport card into the grid
    const addCard = document.createElement('div');
    addCard.className = 'add-child-action-card';
    addCard.title = 'Link a sibling or learner account';
    addCard.innerHTML = `
      <div class="add-card-inner">
        <div class="add-icon-pulsing">
          <span>➕</span>
        </div>
        <div class="add-card-text">
          <h4 class="add-card-title">+ Add Child Acc</h4>
          <p class="add-card-sub">Link sibling account with their unique ID code</p>
        </div>
        <button type="button" class="btn-card-add-child">
          <span>➕</span>
          <span>Link New Child</span>
        </button>
      </div>
    `;
    addCard.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openAddChildModal();
      if (window.soundSFX) window.soundSFX.playPop();
    });
    list.appendChild(addCard);
  }

  openAddChildModal() {
    this.openLinkModal();
  }

  setLinkedChild(childData) {
    this.childData = childData;
    this.currentChildId = childData.id;
    this.renderAll();
  }

  setupEventListeners() {
    // Launcher button in parent unlocked banner
    const launchBtn = document.getElementById('btn-parent-launch-3d');
    if (launchBtn) {
      launchBtn.addEventListener('click', () => {
        const latestUnlocked = Array.from(window.appState.unlockedPhonemes)[0] || 'ka';
        window.appState.switchRole('student');
        const phoneme = getPhonemeById(latestUnlocked);
        window.studentController.openPracticeRoom(phoneme);
        window.soundSFX.playPop();
      });
    }
  }

  renderOverviewMetrics() {
    if (!this.childData) return;

    const nameEl = document.getElementById('parent-child-name');
    const subtextEl = document.getElementById('parent-child-subtext');
    const codePillEl = document.getElementById('parent-linked-code-label');
    const masteredEl = document.getElementById('parent-sounds-mastered');
    const masteredSubEl = document.getElementById('parent-sounds-subtext');
    const streakEl = document.getElementById('parent-practice-streak');
    const streakSubEl = document.getElementById('parent-streak-subtext');
    const clinicianEl = document.getElementById('parent-clinician-name');
    const clinicianSubEl = document.getElementById('parent-clinician-subtext');

    if (nameEl) nameEl.textContent = this.childData.name;
    if (subtextEl) subtextEl.textContent = `Age ${this.childData.age || '6'} • ${this.childData.program || 'Speech Retraining'}`;
    if (codePillEl) codePillEl.textContent = `🆔 ID: ${this.childData.id}`;
    if (masteredEl) masteredEl.textContent = this.childData.masteredCount || '13 / 18';
    if (masteredSubEl) masteredSubEl.textContent = this.childData.masteredSubtext || '↑ 3 sounds mastered this week';
    if (streakEl) streakEl.textContent = `${this.childData.streak || 12} Days 🔥`;
    if (streakSubEl) streakSubEl.textContent = this.childData.streakSubtext || 'Consistent home practice';
    if (clinicianEl) clinicianEl.textContent = this.childData.clinician || 'Dr. Ritu Nair';
    if (clinicianSubEl) clinicianSubEl.textContent = this.childData.clinicianSubtext || 'SLP • Next Session Today 09:30 AM';
  }

  renderAppointments() {
    const list = document.getElementById('parent-appointments-list');
    if (!list) return;

    const appts = this.childData?.appointments || [
      {
        title: "Weekly Telepractice Video Session",
        clinician: "Dr. Ritu Nair (SLP)",
        time: "Today at 09:30 AM",
        status: "Upcoming",
        isToday: true,
        notes: "Target: Velar /k/ phoneme placement"
      },
      {
        title: "Bi-Weekly Clinical Articulation Review",
        clinician: "Dr. Ritu Nair (SLP)",
        time: "Friday, Sep 18 • 04:00 PM",
        status: "Scheduled",
        isToday: false,
        notes: "Target: Retroflex /ṭ/ tongue tip curl"
      }
    ];

    list.innerHTML = '';
    appts.forEach(a => {
      const card = document.createElement('div');
      card.className = 'appointment-item-card';

      const isUpcoming = a.status.toLowerCase() === 'upcoming' || a.isToday;
      const statusClass = isUpcoming ? 'scheduled' : '';

      card.innerHTML = `
        <div class="appointment-card-top">
          <span class="appointment-time-tag">
            <span>⏰</span>
            <span>${a.time}</span>
          </span>
          <span class="appointment-status-badge ${statusClass}">${a.status}</span>
        </div>
        <div class="appointment-title">${a.title}</div>
        <div class="appointment-clinician">
          <span>🩺</span>
          <span>${a.clinician}</span>
        </div>
        <div style="font-size: 12px; color: #475569; background: #ffffff; padding: 6px 10px; border-radius: 8px; border: 1px dashed #cbd5e1; margin-top: 4px;">
          💬 <em>${a.notes}</em>
        </div>
        ${isUpcoming ? `
          <button class="btn-duo btn-blue btn-sm" style="margin-top: 6px; font-size: 12px; padding: 6px 12px;" onclick="window.parentController.joinTelepractice('${a.title}')">
            📹 Join Telepractice Room
          </button>
        ` : ''}
      `;
      list.appendChild(card);
    });
  }

  joinTelepractice(sessionTitle) {
    if (window.soundSFX) window.soundSFX.playCorrect();
    window.appState.showToast('📹 Telepractice Connecting', `Connecting to Dr. Ritu for ${this.childData.name}...`, 'standard');
  }

  bookAppointmentPrompt() {
    const requested = prompt(`Request Telepractice Appointment for ${this.childData.name}:\nEnter preferred date & time (e.g. Next Monday at 10:00 AM):`, "Next Monday at 10:00 AM");
    if (requested) {
      if (!this.childData.appointments) this.childData.appointments = [];
      this.childData.appointments.unshift({
        title: "Caregiver Consult & Articulation Check",
        clinician: "Dr. Ritu Nair (SLP)",
        time: requested,
        status: "Pending Clinician Confirmation",
        isToday: false,
        notes: "Parent requested check-in on practice trajectory"
      });
      this.renderAppointments();
      if (window.soundSFX) window.soundSFX.playUnlockCheer();
      window.appState.showToast('📅 Appointment Requested', `Sent request to Dr. Ritu for ${requested}!`, 'unlock');
    }
  }

  renderAlertBanner() {
    const banner = document.getElementById('parent-alert-banner');
    if (!banner) return;

    const unlockedList = Array.from(window.appState.unlockedPhonemes);

    if (unlockedList.length > 0) {
      const phoneme = getPhonemeById(unlockedList[unlockedList.length - 1]);
      banner.style.display = 'flex';
      banner.innerHTML = `
        <div class="parent-alert-left">
          <div class="parent-alert-icon">✨</div>
          <div class="parent-alert-text">
            <h3>3D Visual Articulation Module Unlocked!</h3>
            <p>
              Dr. Ritu unlocked the guided 3D vocal tract session for target 
              <strong>'${phoneme.symbol}' (${phoneme.name})</strong> to assist ${this.childData ? this.childData.name : 'Aarav'} with home practice.
            </p>
          </div>
        </div>
        <button class="btn-duo btn-gold" id="btn-parent-launch-3d" onclick="window.parentController.launchHome3DPractice('${phoneme.id}')">
          🚀 Guide ${this.childData ? this.childData.name.split(' ')[0] : 'Child'} Now
        </button>
      `;
    } else {
      banner.style.display = 'none';
    }
  }

  launchHome3DPractice(phonemeId) {
    window.soundSFX.playUnlockCheer();
    window.appState.switchRole('student');
    const phoneme = getPhonemeById(phonemeId);
    window.studentController.openPracticeRoom(phoneme);
  }

  renderProgressBars() {
    const container = document.getElementById('parent-progress-group-list');
    if (!container) return;

    const groups = this.childData?.progressGroups || [
      { name: "Sparsh (Stops / स्पर्श - क to म: 25 Letters)", mastered: "18 / 25", percent: 72, color: "green" },
      { name: "Anthastha (Approximants / अन्तःस्थ - य, र, ल, व)", mastered: "3 / 4", percent: 75, color: "blue" },
      { name: "Ushma & Glottal (ऊष्म व कण्ठ्य - श, ष, स, ह)", mastered: "3 / 4", percent: 75, color: "coral" },
      { name: "Samyukt Blends (संयुक्ताक्षर - क्ष, त्र, ज्ञ, श्र)", mastered: "2 / 4", percent: 50, color: "green" },
      { name: "English Articulation Targets (/r/, /th/)", mastered: "1 / 2", percent: 50, color: "blue" }
    ];

    container.innerHTML = '';
    groups.forEach(g => {
      const item = document.createElement('div');
      item.className = 'progress-group-item';
      item.innerHTML = `
        <div class="progress-header">
          <span>${g.name}</span>
          <span style="font-weight:900;">${g.mastered} Mastered (${g.percent}%)</span>
        </div>
        <div class="progress-track-duo">
          <div class="progress-bar-fill ${g.color}" style="width: ${g.percent}%;"></div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  renderHeatmapCalendar() {
    const grid = document.getElementById('parent-heatmap-grid');
    if (!grid) return;

    grid.innerHTML = '';
    // Generate 30 days of activity
    for (let day = 1; day <= 30; day++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-day-cell';
      cell.textContent = day;

      if (day === 11) {
        cell.classList.add('struggle');
        cell.title = `Day ${day}: Struggle recorded with 'क' (5 failed attempts). 3D model unlocked by Dr. Ritu.`;
      } else if (day % 6 === 0) {
        cell.title = `Day ${day}: Rest day`;
      } else if (day % 5 === 0) {
        cell.classList.add('level-3');
        cell.title = `Day ${day}: 45 min practice (94% accuracy, 50 gems earned)`;
      } else if (day % 2 === 0) {
        cell.classList.add('level-2');
        cell.title = `Day ${day}: 30 min practice (82% accuracy)`;
      } else {
        cell.classList.add('level-1');
        cell.title = `Day ${day}: 15 min quick review`;
      }

      grid.appendChild(cell);
    }
  }

  renderTherapistNotes() {
    const feed = document.getElementById('parent-therapist-notes-feed');
    if (!feed) return;

    const notes = this.childData?.notes || [
      {
        date: "Today, 10:15 AM",
        therapist: "Dr. Ritu Nair (Speech Language Pathologist)",
        target: "Target: 'क' (Ka - Velar Stop)",
        content: `Observed ${this.childData.name} struggling with posterior tongue elevation (velar fronting: substituting 'त' for 'क'). I have unlocked the 3D anatomical video module. Please have ${this.childData.name.split(' ')[0]} watch the dragon puff airflow simulation before practice.`
      }
    ];

    feed.innerHTML = '';
    notes.forEach(note => {
      const card = document.createElement('div');
      card.className = 'feed-item-card';
      card.innerHTML = `
        <div class="feed-header">
          <span class="therapist-badge">👩‍⚕️ ${note.therapist}</span>
          <span class="feed-date">${note.date}</span>
        </div>
        <p class="feed-body">${note.content}</p>
        <div class="feed-assigned-target">${note.target}</div>
      `;
      feed.appendChild(card);
    });
  }

  // ==========================================
  // MODAL LOGIC: LINK CHILD UNIQUE ID
  // ==========================================
  openLinkModal() {
    const modal = document.getElementById('parent-link-child-modal');
    if (modal) {
      modal.classList.add('active');
      const input = document.getElementById('input-child-unique-id');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  closeLinkModal() {
    const modal = document.getElementById('parent-link-child-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  }

  fillDemoChildId(code) {
    const input = document.getElementById('input-child-unique-id');
    if (input) {
      input.value = code;
      input.focus();
    }
    if (window.soundSFX) window.soundSFX.playPop();
  }

  handleLinkChildSubmit() {
    const input = document.getElementById('input-child-unique-id');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    if (!code) return;

    if (window.appState) {
      const success = window.appState.linkChildToParent(code);
      if (success) {
        this.closeLinkModal();
        this.renderChildrenSelector();
      }
    }
  }
}

window.ParentViewController = ParentViewController;
