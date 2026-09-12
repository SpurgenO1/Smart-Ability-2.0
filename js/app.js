/**
 * Smart Articulation Training System - Application Master Controller
 * Inside Out Theme, Pet Mascot State, Points / Memory Gems & 3D Video Slot,
 * Multi-portal Authentication & Unique Child-Parent Pairing Engine
 */

class AppStateManager {
  constructor() {
    this.currentRole = 'hero'; // 'hero', 'student', 'therapist', 'parent'
    
    // Gamification Points & Inside Out Memory Gems
    this.points = 140; // Starter points so kids can immediately try the boutique!
    this.streak = 12;
    this.hearts = 5;
    this.crowns = 14;

    // Pet Customization
    this.chosenPet = 'cat'; // 'cat', 'rabbit', 'pup'
    this.equippedAccessory = 'party_hat'; // 'none', 'party_hat', 'pink_bow', etc.
    this.unlockedAccessories = new Set(['none', 'party_hat', 'pink_bow']);

    // Dedicated 3D/2D video slot state
    this.activeVideoDimension = '3d'; // '3d' or '2d'
    this.customVideoUrl = '';

    // Clinical Struggle Alerts (5-Failure Rule)
    this.struggleAlerts = [
      {
        id: 101,
        studentId: "ORB-4819",
        studentName: "Aarav Sharma",
        age: "6 yrs",
        phonemeId: "ka",
        phonemeSymbol: "क",
        phonemeName: "Ka (क - Velar Stop)",
        timestamp: "Today, 10:14 AM",
        consecutiveFailures: 5,
        status: "pending", // 'pending' | 'approved' | 'rejected'
        resolved: false,
        deficitReason: "Velar Fronting: Substituting dental /t/ for velar /k/ with anterior tongue tip elevation.",
        recommendedVideoTitle: "Dragon Breath Velar Occlusion (vowel_1.mp4)",
        videoUrl: "assets/videos/vowel_1.mp4"
      },
      {
        id: 102,
        studentId: "ORB-9201",
        studentName: "Kabir Mehta",
        age: "6 yrs",
        phonemeId: "ta_retro",
        phonemeSymbol: "ट",
        phonemeName: "Ṭa (ट - Retroflex Stop)",
        timestamp: "Today, 09:45 AM",
        consecutiveFailures: 5,
        status: "pending",
        resolved: false,
        deficitReason: "Flat Tongue Posture: Incomplete retroflex curling contacting alveolar ridge instead of hard palate.",
        recommendedVideoTitle: "Retroflex Curling Sagittal Demonstration (vowel_1.mp4)",
        videoUrl: "assets/videos/vowel_1.mp4"
      },
      {
        id: 103,
        studentId: "ORB-7320",
        studentName: "Ananya Verma",
        age: "7 yrs",
        phonemeId: "swar_aa",
        phonemeSymbol: "आ",
        phonemeName: "Aa (आ - Open Central Vowel)",
        timestamp: "Yesterday, 04:20 PM",
        consecutiveFailures: 5,
        status: "pending",
        resolved: false,
        deficitReason: "Restricted Jaw Aperture: Insufficient vertical mandibular lowering for open vowel space.",
        recommendedVideoTitle: "Wide Jaw Aperture Articulation Guide (vowel_1.mp4)",
        videoUrl: "assets/videos/vowel_1.mp4"
      }
    ];

    // Per-Student Unlocked Clinical Demonstration Videos
    // Mapping: { [studentId]: { [phonemeId]: { status: 'approved'|'rejected', videoUrl, approvedAt, approvedBy, notes } } }
    this.studentDemonstrations = {
      'ORB-4819': {},
      'ORB-7320': {},
      'ORB-9201': {}
    };

    // Unlocked 3D/2D Guided Modules (legacy support)
    this.unlockedPhonemes = new Set(['ta_retro']);
    this.completedPhonemes = new Set(['swar_a']); // 'अ' mastered with gold star ⭐, 'swar_aa' ('आ') is active glowing!
    this.activeTargetPhonemeId = 'swar_aa';
    this.userAvatar = '👦';
    this.isLoggedIn = false;

    // Active Child & Linked Account Directory
    this.activeStudentId = 'ORB-4819';
    this.linkedChildrenIds = ['ORB-4819', 'ORB-7320']; // Pre-link both demo children for rich multi-child experience
    this.linkedChildId = 'ORB-4819'; // Currently active viewed child

    // Clinical Caseload Allotment Notifications for Therapist
    this.therapistAllottedNotifications = [
      { id: 'ORB-9201', name: 'Kabir Mehta', age: '6', allottedAt: 'Today, 08:30 AM' }
    ];

    this.studentsDirectory = {
      'ORB-4819': {
        id: 'ORB-4819',
        name: 'Aarav Sharma',
        age: '6',
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
      },
      'ORB-7320': {
        id: 'ORB-7320',
        name: 'Ananya Verma',
        age: '7',
        program: 'Pediatric Articulation & Vowel Coaching',
        masteredCount: '15 / 18',
        masteredSubtext: '↑ 4 sounds mastered this week',
        streak: 15,
        streakSubtext: 'Dedicated daily home speech practice',
        clinician: 'Dr. Ritu Nair (SLP)',
        clinicianSubtext: 'SLP • Next Session Friday 04:00 PM',
        progressGroups: [
          { name: "Swar (Vowels / स्वर - अ to अः: 13 Sounds)", mastered: "13 / 13", percent: 100, color: "blue" },
          { name: "Sparsh (Stops / स्पर्श - क to म: 25 Letters)", mastered: "20 / 25", percent: 80, color: "green" },
          { name: "Anthastha (Approximants / अन्तःस्थ - य, र, ल, व)", mastered: "4 / 4", percent: 100, color: "blue" },
          { name: "Ushma & Glottal (ऊष्म व कण्ठ्य - श, ष, स, ह)", mastered: "3 / 4", percent: 75, color: "coral" },
          { name: "Samyukt Blends (संयुक्ताक्षर - क्ष, त्र, ज्ञ, श्र)", mastered: "3 / 4", percent: 75, color: "green" }
        ],
        appointments: [
          {
            title: "Bi-Weekly Clinical Articulation Review",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Friday at 04:00 PM",
            status: "Upcoming",
            isToday: false,
            notes: "Reviewing dental stop accuracy and vocalic transitions"
          }
        ],
        notes: [
          {
            date: "Today, 11:30 AM",
            therapist: "Dr. Ritu Nair (Speech Language Pathologist)",
            target: "Target: 'इ' and 'ई' (Front Close Vowels)",
            content: "Ananya demonstrated outstanding wide-smile vocalic imitation on both short and long /i/ vowels. Ready to advance into dental stops."
          }
        ]
      },
      'ORB-9201': {
        id: 'ORB-9201',
        name: 'Kabir Mehta',
        age: '6',
        program: 'Pediatric Articulation Retraining',
        masteredCount: '8 / 18',
        masteredSubtext: '↑ 2 sounds mastered this week',
        streak: 8,
        streakSubtext: 'Consistent home speech practice',
        clinician: 'Dr. Ritu Nair (SLP)',
        clinicianSubtext: 'SLP • Clinical Supervisor',
        progressGroups: [
          { name: "Swar (Vowels / स्वर - अ to अः: 13 Sounds)", mastered: "9 / 13", percent: 69, color: "blue" },
          { name: "Sparsh (Stops / स्पर्श - क to म: 25 Letters)", mastered: "11 / 25", percent: 44, color: "green" },
          { name: "Anthastha (Approximants / अन्तःस्थ - य, र, ल, व)", mastered: "2 / 4", percent: 50, color: "blue" },
          { name: "Ushma & Glottal (ऊष्म व कण्ठ्य - श, ष, स, ह)", mastered: "1 / 4", percent: 25, color: "coral" },
          { name: "Samyukt Blends (संयुक्ताक्षर - क्ष, त्र, ज्ञ, श्र)", mastered: "1 / 4", percent: 25, color: "green" }
        ],
        appointments: [
          {
            title: "Articulation Placement Coaching",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Thursday at 02:30 PM",
            status: "Upcoming",
            isToday: false,
            notes: "Retroflex curling placement guidance"
          }
        ],
        notes: [
          {
            date: "Yesterday",
            therapist: "Dr. Ritu Nair (Speech Language Pathologist)",
            target: "Target: 'ट' (Ṭa - Retroflex)",
            content: "Kabir is working on tongue tip curling. Recommending visual demonstration if 5-attempt fatigue occurs."
          }
        ]
      }
    };
  }

  getDefaultChildData() {
    return this.studentsDirectory['ORB-4819'];
  }

  generateUniqueLearnerId() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORB-${randomSuffix}`;
  }

  init() {
    this.updateNotificationBadges();
    this.updateHUD();
    this.updateStudentIdDisplay(this.activeStudentId);
  }

  updateStudentIdDisplay(id) {
    const pill = document.getElementById('student-display-id');
    if (pill) pill.textContent = id;
    const modalId = document.getElementById('modal-student-unique-id');
    if (modalId) modalId.textContent = id;
  }

  loginAs(role, identifier = '') {
    this.isLoggedIn = true;
    this.currentRole = role;

    // Set default persona avatar if not customized
    if (role === 'therapist') this.userAvatar = '🩺';
    else if (role === 'parent') this.userAvatar = '👩‍👧';
    else if (role === 'student' && (!this.userAvatar || this.userAvatar === '🩺' || this.userAvatar === '👩‍👧')) this.userAvatar = '👦';

    if (window.settingsController) {
      window.settingsController.updateHeaderAvatarBadge(this.userAvatar);
    }

    // Show header session controls
    const sessionArea = document.getElementById('header-session-area');
    if (sessionArea) sessionArea.style.display = 'flex';

    // Toggle specific role HUD in header
    const studentHud = document.getElementById('student-hud');
    const therapistHud = document.getElementById('therapist-hud');
    const parentHud = document.getElementById('parent-hud');

    if (studentHud) studentHud.style.display = (role === 'student') ? 'flex' : 'none';
    if (therapistHud) therapistHud.style.display = (role === 'therapist') ? 'flex' : 'none';
    if (parentHud) parentHud.style.display = (role === 'parent') ? 'flex' : 'none';

    // Activate selected portal view
    document.querySelectorAll('.portal-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetPortal = document.getElementById(`${role}-portal-view`);
    if (targetPortal) {
      targetPortal.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (role === 'student' && window.studentController) {
      this.updateStudentIdDisplay(this.activeStudentId);
      window.studentController.renderPathMap();
      window.studentController.renderTileMatrix();
      window.studentController.renderPetAvatar();
    } else if (role === 'therapist' && window.therapistController) {
      window.therapistController.renderAllotmentBanner();
      window.therapistController.renderProgressNotification();
      window.therapistController.renderStruggleAlerts();
      window.therapistController.renderSchedule();
    } else if (role === 'parent' && window.parentController) {
      // If parent has not linked child yet, prompt them with popup modal
      if (!this.linkedChildId) {
        window.parentController.openLinkModal();
      } else {
        const childData = this.studentsDirectory[this.linkedChildId] || this.getDefaultChildData();
        window.parentController.setLinkedChild(childData);
      }
      window.parentController.renderAlertBanner();
      window.parentController.renderProgressBars();
      window.parentController.renderAppointments();
    }

    this.updateNotificationBadges();
    this.updateHUD();

    const titles = { student: 'Student Explorer', therapist: 'Clinician / Therapist', parent: 'Parent / Caregiver' };
    this.showToast('🚀 Logged In', `Welcome to your ${titles[role]} session!`, 'standard');
    if (window.soundSFX) window.soundSFX.playCorrect();
  }

  registerAndLogin(role, name) {
    this.isLoggedIn = true;
    this.currentRole = role;

    // Show header session controls
    const sessionArea = document.getElementById('header-session-area');
    if (sessionArea) sessionArea.style.display = 'flex';

    const studentHud = document.getElementById('student-hud');
    const therapistHud = document.getElementById('therapist-hud');
    const parentHud = document.getElementById('parent-hud');

    if (studentHud) studentHud.style.display = (role === 'student') ? 'flex' : 'none';
    if (therapistHud) therapistHud.style.display = (role === 'therapist') ? 'flex' : 'none';
    if (parentHud) parentHud.style.display = (role === 'parent') ? 'flex' : 'none';

    document.querySelectorAll('.portal-view').forEach(view => {
      view.classList.remove('active');
    });

    const targetPortal = document.getElementById(`${role}-portal-view`);
    if (targetPortal) {
      targetPortal.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (role === 'student') {
      // 1. GENERATE UNIQUE LEARNER ID FOR NEW CHILD
      const newId = this.generateUniqueLearnerId();
      this.activeStudentId = newId;

      // Register new student into system directory
      this.studentsDirectory[newId] = {
        id: newId,
        name: name,
        age: '6',
        program: 'Pediatric Articulation Retraining',
        masteredCount: '1 / 18',
        masteredSubtext: 'Starting speech exploration!',
        streak: 1,
        streakSubtext: 'Day 1 of speech adventure',
        clinician: 'Dr. Ritu Nair (SLP)',
        clinicianSubtext: 'SLP • Clinical Supervisor',
        progressGroups: [
          { name: "Swar (Vowels / स्वर - अ to अः: 13 Sounds)", mastered: "1 / 13", percent: 8, color: "blue" },
          { name: "Sparsh (Stops / स्पर्श - क to म: 25 Letters)", mastered: "1 / 25", percent: 4, color: "green" },
          { name: "Anthastha (Approximants / अन्तःस्थ - य, र, ल, व)", mastered: "0 / 4", percent: 0, color: "blue" },
          { name: "Ushma & Glottal (ऊष्म व कण्ठ्य - श, ष, स, ह)", mastered: "0 / 4", percent: 0, color: "coral" },
          { name: "Samyukt Blends (संयुक्ताक्षर - क्ष, त्र, ज्ञ, श्र)", mastered: "0 / 4", percent: 0, color: "green" }
        ],
        appointments: [
          {
            title: "Welcome Intake & Speech Evaluation",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Tomorrow at 10:00 AM",
            status: "Upcoming",
            isToday: false,
            notes: "Diagnostic assessment for articulation baseline and oral motor milestones"
          },
          {
            title: "Telepractice Interactive Orientation",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Friday at 03:30 PM",
            status: "Scheduled",
            isToday: false,
            notes: "Introducing 3D vocal tract animations & memory orb rewards"
          }
        ],
        notes: [
          {
            date: "Today, Just Now",
            therapist: "Dr. Ritu Nair (Speech Language Pathologist)",
            target: "Target: Speech Journey Onboarding",
            content: `Welcome to the studio ${name}! Begin by exploring Joy's core velar target 'क' and earn glowing memory orbs!`
          }
        ]
      };

      this.updateStudentIdDisplay(newId);

      // Automatically allot new student to Therapist's clinical caseload
      if (!this.therapistAllottedNotifications) this.therapistAllottedNotifications = [];
      this.therapistAllottedNotifications.unshift({
        id: newId,
        name: name,
        age: '6',
        allottedAt: 'Just now'
      });
      if (window.therapistController) {
        window.therapistController.renderAllotmentBanner();
      }

      if (window.studentController) {
        window.studentController.renderPathMap();
        window.studentController.renderTileMatrix();
        window.studentController.renderPetAvatar();
      }

      // Pop up the celebration modal with student's unique ID!
      this.openStudentIdModal(newId);

    } else if (role === 'parent') {
      // 2. PARENT ACCOUNT CREATION: PROMPT TO ENTER CHILD'S UNIQUE ID
      this.linkedChildId = null; // Unlinked initially to trigger pop-up
      if (window.parentController) {
        window.parentController.openLinkModal();
      }
    }

    this.updateNotificationBadges();
    this.updateHUD();

    this.showToast('🎉 Account Created', `Welcome to the speech studio, ${name}!`, 'unlock');
    if (window.soundSFX) window.soundSFX.playUnlockCheer();
  }

  // ==========================================
  // STUDENT UNIQUE ID CELEBRATION MODAL
  // ==========================================
  openStudentIdModal(id) {
    const modal = document.getElementById('student-unique-id-modal');
    if (modal) {
      const idEl = document.getElementById('modal-student-unique-id');
      if (idEl) idEl.textContent = id;
      modal.classList.add('active');
    }
  }

  closeStudentIdModal() {
    const modal = document.getElementById('student-unique-id-modal');
    if (modal) {
      modal.classList.remove('active');
    }
    if (window.soundSFX) window.soundSFX.playPop();
  }

  copyStudentId() {
    const idEl = document.getElementById('modal-student-unique-id') || document.getElementById('student-display-id');
    const textToCopy = idEl ? idEl.textContent.trim() : this.activeStudentId;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        this.showToast('📋 Copied Code!', `Copied ${textToCopy} to clipboard! Share with parent.`, 'unlock');
        if (window.soundSFX) window.soundSFX.playCorrect();
      }).catch(() => {
        this.fallbackCopyText(textToCopy);
      });
    } else {
      this.fallbackCopyText(textToCopy);
    }
  }

  fallbackCopyText(text) {
    prompt("Copy your Unique Speech ID:", text);
    this.showToast('📋 Speech ID', `ID: ${text}`, 'standard');
    if (window.soundSFX) window.soundSFX.playCorrect();
  }

  // ==========================================
  // PARENT LINKING CHILD LOGIC
  // ==========================================
  linkChildToParent(childId) {
    let child = this.studentsDirectory[childId];

    if (!child) {
      // Gracefully create a child record if an arbitrary ID was typed, so user is never locked out
      child = {
        id: childId,
        name: `Learner (${childId})`,
        age: '6',
        program: 'Pediatric Speech Retraining',
        masteredCount: '6 / 18',
        masteredSubtext: 'Linked via Parent Portal',
        streak: 5,
        streakSubtext: 'Recent home practice',
        clinician: 'Dr. Ritu Nair (SLP)',
        clinicianSubtext: 'SLP • Active Clinician',
        progressGroups: [
          { name: "Swar (Vowels / स्वर - अ to अः: 13 Sounds)", mastered: "8 / 13", percent: 61, color: "blue" },
          { name: "Sparsh (Stops / स्पर्श - क to म: 25 Letters)", mastered: "10 / 25", percent: 40, color: "green" },
          { name: "Anthastha (Approximants / अन्तःस्थ - य, र, ल, व)", mastered: "1 / 4", percent: 25, color: "blue" },
          { name: "Ushma & Glottal (ऊष्म व कण्ठ्य - श, ष, स, ह)", mastered: "1 / 4", percent: 25, color: "coral" },
          { name: "Samyukt Blends (संयुक्ताक्षर - क्ष, त्र, ज्ञ, श्र)", mastered: "0 / 4", percent: 0, color: "green" }
        ],
        appointments: [
          {
            title: "Telepractice Speech Check-In",
            clinician: "Dr. Ritu Nair (SLP)",
            time: "Tomorrow at 11:00 AM",
            status: "Upcoming",
            isToday: false,
            notes: "Monitoring sound placement and caregiver guidance"
          }
        ],
        notes: [
          {
            date: "Today",
            therapist: "Dr. Ritu Nair (Speech Language Pathologist)",
            target: "Target: Phoneme Articulation",
            content: `Connected with parent! Ready to monitor sessions, appointments, and 3D visual practice.`
          }
        ]
      };
      this.studentsDirectory[childId] = child;
    }

    if (!this.linkedChildrenIds.includes(childId)) {
      this.linkedChildrenIds.push(childId);
    }
    this.linkedChildId = childId;

    if (window.parentController) {
      window.parentController.setLinkedChild(child);
    }

    // Update parent HUD
    const parentHudLabel = document.querySelector('#parent-hud .stat-chip span:nth-child(2)');
    if (parentHudLabel) {
      parentHudLabel.textContent = `${child.name.split(' ')[0]}'s Caregiver Hub`;
    }

    if (window.soundSFX) window.soundSFX.playUnlockCheer();
    this.showToast('🎉 Child Account Added!', `Now monitoring ${child.name} alongside your other children!`, 'unlock');
    return true;
  }

  switchLinkedChild(childId) {
    if (this.studentsDirectory[childId]) {
      this.linkedChildId = childId;
      const child = this.studentsDirectory[childId];
      if (window.parentController) {
        window.parentController.setLinkedChild(child);
      }
      if (window.settingsController) {
        window.settingsController.selectedStudentId = childId;
        window.settingsController.renderEverydayReport();
      }
      const parentHudLabel = document.querySelector('#parent-hud .stat-chip span:nth-child(2)');
      if (parentHudLabel) {
        parentHudLabel.textContent = `${child.name.split(' ')[0]}'s Caregiver Hub`;
      }
      this.showToast('🔄 Switched Child', `Now viewing ${child.name}'s speech dashboard.`, 'standard');
      if (window.soundSFX) window.soundSFX.playPop();
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.currentRole = 'hero';

    if (window.apiClient) {
      window.apiClient.logout();
    }
    if (window.socketClient) {
      window.socketClient.disconnect();
    }

    // Hide session area in header
    const sessionArea = document.getElementById('header-session-area');
    if (sessionArea) sessionArea.style.display = 'none';

    // Close any open modals
    this.closeStudentIdModal();
    if (window.parentController) {
      window.parentController.closeLinkModal();
    }

    // Deactivate all portals and activate hero
    document.querySelectorAll('.portal-view').forEach(view => {
      view.classList.remove('active');
    });

    const heroPortal = document.getElementById('hero-portal-view');
    if (heroPortal) {
      heroPortal.classList.add('active');
    }

    // Reset hero auth card to role selection card
    const roleCard = document.getElementById('hero-login-card');
    const authCard = document.getElementById('hero-auth-card');
    if (roleCard) roleCard.style.display = 'flex';
    if (authCard) authCard.style.display = 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.soundSFX) window.soundSFX.playPop();
    this.showToast('🚪 Logged Out', 'Returned to Login Screen.', 'standard');
  }

  switchRole(role) {
    if (role === 'hero') {
      this.logout();
      return;
    }
    this.loginAs(role);
  }

  addPoints(amount) {
    this.points += amount;
    this.updateHUD();
    window.soundSFX.playUnlockCheer();
    this.showToast('✨ Memory Orbs Earned!', `+${amount} points collected! Total: ${this.points} 🔮`, 'unlock');
  }

  spendPoints(amount) {
    if (this.points >= amount) {
      this.points -= amount;
      this.updateHUD();
      return true;
    }
    return false;
  }

  setChosenPet(petKey) {
    if (PET_DATA[petKey]) {
      this.chosenPet = petKey;
      if (window.studentController) {
        window.studentController.renderPetAvatar();
      }
      this.showToast('🐾 Pet Companion Switched', `Meet ${PET_DATA[petKey].name}!`, 'standard');
    }
  }

  equipAccessory(accId) {
    this.equippedAccessory = accId;
    if (window.studentController) {
      window.studentController.renderPetAvatar();
    }
    this.showToast('🎀 Pet Dressed Up!', `Equipped ${accId.replace('_', ' ')} on your pet!`, 'standard');
  }

  updateHUD() {
    const pointsEl = document.getElementById('stat-points');
    const streakEl = document.getElementById('stat-streak');
    const heartsEl = document.getElementById('stat-hearts');
    const crownsEl = document.getElementById('stat-crowns');

    if (pointsEl) pointsEl.textContent = `${this.points} 🔮`;
    if (streakEl) streakEl.textContent = this.streak;
    if (heartsEl) heartsEl.textContent = this.hearts;
    if (crownsEl) crownsEl.textContent = this.crowns;
  }

  addStruggleAlert(alertData) {
    if (!alertData.status) alertData.status = 'pending';
    this.struggleAlerts.unshift(alertData);
    this.updateNotificationBadges();
    if (window.therapistController) {
      window.therapistController.renderStruggleAlerts();
      if (typeof window.therapistController.renderDemonstrationPushList === 'function') {
        window.therapistController.renderDemonstrationPushList();
      }
    }
  }

  resolveAlert(alertId) {
    const alert = this.struggleAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.status = 'approved';
    }
    this.updateNotificationBadges();
  }

  /**
   * Approves pushing demonstration video to ONE SPECIFIC STUDENT
   * The video demonstration becomes viewable ONLY by that student, not to every student.
   */
  approveDemonstrationPush(alertId, customVideoUrl = '') {
    const alert = this.struggleAlerts.find(a => a.id === alertId);
    if (!alert) return;

    alert.status = 'approved';
    alert.resolved = true;
    alert.resolvedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const studentId = alert.studentId || this.activeStudentId;
    if (!this.studentDemonstrations[studentId]) {
      this.studentDemonstrations[studentId] = {};
    }

    const videoUrl = customVideoUrl || alert.videoUrl || 'assets/videos/vowel_1.mp4';
    this.studentDemonstrations[studentId][alert.phonemeId] = {
      status: 'approved',
      videoUrl: videoUrl,
      approvedAt: alert.resolvedAt,
      approvedBy: 'Dr. Ritu Nair (SLP)',
      notes: `Targeted clinical articulation demonstration pushed to address 5-attempt struggle on '${alert.phonemeSymbol}'.`
    };

    // If the currently active viewed student is this student, unlock their active session
    if (this.activeStudentId === studentId) {
      this.unlockedPhonemes.add(alert.phonemeId);
    }

    this.updateNotificationBadges();

    // Re-render UI components
    if (window.therapistController) {
      window.therapistController.renderStruggleAlerts();
      if (typeof window.therapistController.renderDemonstrationPushList === 'function') {
        window.therapistController.renderDemonstrationPushList();
      }
    }
    if (window.studentController) {
      window.studentController.updatePracticeStageUI();
      window.studentController.updateVideoSlotDisplay();
      window.studentController.renderPathMap();
      window.studentController.renderTileMatrix();
    }
    if (window.parentController) {
      window.parentController.renderAlertBanner();
    }

    window.soundSFX?.playUnlockCheer();
    this.showToast(
      '🎬 Demonstration Video Approved!',
      `Clinical demonstration for '${alert.phonemeSymbol}' approved & pushed to ${alert.studentName}. Accessible only to this student!`,
      'unlock'
    );
  }

  /**
   * Rejects pushing demonstration video for a student
   * Leaves demonstration video locked; clinician recommends live coaching instead.
   */
  rejectDemonstrationPush(alertId, reason = '') {
    const alert = this.struggleAlerts.find(a => a.id === alertId);
    if (!alert) return;

    alert.status = 'rejected';
    alert.resolved = true;
    alert.rejectedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    alert.rejectReason = reason || 'Recommended in-person tactile placement cues during upcoming live session.';

    const studentId = alert.studentId || this.activeStudentId;
    if (!this.studentDemonstrations[studentId]) {
      this.studentDemonstrations[studentId] = {};
    }

    this.studentDemonstrations[studentId][alert.phonemeId] = {
      status: 'rejected',
      rejectedAt: alert.rejectedAt,
      rejectedBy: 'Dr. Ritu Nair (SLP)',
      reason: alert.rejectReason
    };

    this.updateNotificationBadges();

    if (window.therapistController) {
      window.therapistController.renderStruggleAlerts();
      if (typeof window.therapistController.renderDemonstrationPushList === 'function') {
        window.therapistController.renderDemonstrationPushList();
      }
    }
    if (window.studentController) {
      window.studentController.updatePracticeStageUI();
      window.studentController.updateVideoSlotDisplay();
    }

    window.soundSFX?.playGentleTryAgain();
    this.showToast(
      '❌ Video Push Rejected',
      `Demonstration video push rejected for ${alert.studentName}. Clinical guidance set to 1-on-1 session.`,
      'standard'
    );
  }

  /**
   * Checks whether a demonstration video is approved specifically for this student
   */
  isDemonstrationApprovedForStudent(studentId, phonemeId) {
    if (!studentId || !phonemeId) return false;
    const studentUnlocks = this.studentDemonstrations[studentId];
    if (!studentUnlocks) return false;
    return studentUnlocks[phonemeId]?.status === 'approved';
  }

  getStudentDemonstrationStatus(studentId, phonemeId) {
    if (!studentId || !phonemeId) return { status: 'locked' };
    const studentUnlocks = this.studentDemonstrations[studentId];
    if (studentUnlocks && studentUnlocks[phonemeId]) {
      return studentUnlocks[phonemeId];
    }
    return { status: 'locked' };
  }

  /**
   * Switches the active student being tested/viewed
   */
  switchActiveStudent(studentId) {
    if (this.studentsDirectory[studentId]) {
      this.activeStudentId = studentId;
      this.updateStudentIdDisplay(studentId);

      const studentName = this.studentsDirectory[studentId].name;
      if (window.studentController) {
        window.studentController.updatePracticeStageUI();
        window.studentController.updateVideoSlotDisplay();
        window.studentController.renderPathMap();
        window.studentController.renderTileMatrix();
      }

      this.showToast(
        '🔄 Switched Active Learner',
        `Now testing as ${studentName} (ID: ${studentId})`,
        'standard'
      );
    }
  }

  unlockPhoneme3D(phonemeId) {
    // When called directly without student context, unlock for active student
    if (!this.studentDemonstrations[this.activeStudentId]) {
      this.studentDemonstrations[this.activeStudentId] = {};
    }
    this.studentDemonstrations[this.activeStudentId][phonemeId] = {
      status: 'approved',
      videoUrl: 'assets/videos/vowel_1.mp4',
      approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      approvedBy: 'Dr. Ritu Nair (SLP)'
    };
    this.unlockedPhonemes.add(phonemeId);

    if (window.studentController) {
      window.studentController.updateVideoSlotDisplay();
      window.studentController.renderPathMap();
      window.studentController.renderTileMatrix();
    }

    if (window.parentController) {
      window.parentController.renderAlertBanner();
    }
  }

  markPhonemeCompleted(phonemeId) {
    this.completedPhonemes.add(phonemeId);

    // Automatically make the next Hindi letter in order start glowing!
    if (typeof getAllPhonemes === 'function') {
      const all = getAllPhonemes('hindi');
      const idx = all.findIndex(p => p.id === phonemeId);
      if (idx !== -1 && idx < all.length - 1) {
        this.activeTargetPhonemeId = all[idx + 1].id;
      }
    }

    if (window.studentController) {
      window.studentController.renderPathMap();
      window.studentController.renderTileMatrix();
    }
  }

  setActiveTargetPhoneme(phonemeId) {
    this.activeTargetPhonemeId = phonemeId;
    if (window.studentController) {
      window.studentController.renderPathMap();
    }
  }

  updateNotificationBadges() {
    const pendingCount = this.struggleAlerts.filter(a => a.status === 'pending' || (!a.resolved && a.status !== 'rejected')).length;
    const badgeEl = document.getElementById('therapist-alert-badge');
    if (badgeEl) {
      if (pendingCount > 0) {
        badgeEl.style.display = 'inline-block';
        badgeEl.textContent = `${pendingCount} Struggle Alert${pendingCount > 1 ? 's' : ''}`;
      } else {
        badgeEl.style.display = 'none';
      }
    }

    const demoCountEl = document.getElementById('therapist-demo-push-count');
    if (demoCountEl) {
      demoCountEl.textContent = pendingCount;
      demoCountEl.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
    }
  }

  showToast(title, message, type = 'standard') {
    const container = document.getElementById('duo-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `duo-toast ${type}`;

    const icon = type === 'alert' ? '🚨' : type === 'unlock' ? '🔮' : '🐾';

    toast.innerHTML = `
      <div class="duo-toast-icon">${icon}</div>
      <div class="duo-toast-content">
        <h4>${title}</h4>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

window.appState = new AppStateManager();

document.addEventListener('DOMContentLoaded', () => {
  window.appState.init();

  window.studentController = new StudentViewController();
  window.studentController.init();

  window.therapistController = new TherapistViewController();
  window.therapistController.init();

  window.parentController = new ParentViewController();
  window.parentController.init();

  if (window.heroController) {
    window.heroController.init();
  }

  if (window.settingsController) {
    window.settingsController.init();
  }

  // Restore authenticated session if valid token exists, otherwise start on Hero Landing Page
  if (window.apiClient && window.apiClient.isAuthenticated()) {
    const user = window.apiClient.currentUser;
    const role = user?.role || 'student';
    console.log(`[App] Restoring authenticated ${role} session for ${user?.email || 'user'}`);
    window.appState.loginAs(role);
    if (window.socketClient) {
      window.socketClient.connect();
    }
  } else {
    window.appState.switchRole('hero');
  }

  console.log("Smart Articulation Training System initialized with Hero Landing Page, Inside Out theme, Unique Child IDs & Parent Pairing.");
});
