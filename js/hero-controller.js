/**
 * Smart Articulation Training System - Hero Login & Registration Controller
 * Handles role selection, role-specific authentication, demo auto-fill,
 * and restricts registration exclusively to Students and Parents (not Therapists).
 */

class HeroPageController {
  constructor() {
    this.selectedRole = 'student'; // 'student', 'therapist', 'parent'
    this.authMode = 'signin'; // 'signin', 'register'

    // Preset reviewer demo credentials
    this.demoCredentials = {
      student: {
        identifier: 'aarav@speech.edu',
        password: 'studentpassword',
        name: 'Aarav Sharma',
        label: 'Auto-fill Demo Account (Aarav Sharma, Age 6)'
      },
      therapist: {
        identifier: 'dr.ritu@speechclinic.org',
        password: 'clinicianpassword',
        name: 'Dr. Ritu Nair',
        label: 'Auto-fill Demo Account (Dr. Ritu Nair, SLP)'
      },
      parent: {
        identifier: 'sharma.family@email.com',
        password: 'parentpassword',
        name: 'Pooja Sharma',
        label: 'Auto-fill Demo Account (Sharma Family)'
      }
    };
  }

  init() {
    this.setupRoleSelection();
    this.setupAuthNavigation();
    this.setupAuthTabs();
    this.setupDemoAutofill();
    this.setupFormSubmissions();
    this.updateRoleSelectionUI(this.selectedRole);
  }

  /* =========================================================
     STAGE 1: ROLE SELECTION
     ========================================================= */
  setupRoleSelection() {
    const cards = document.querySelectorAll('.role-character-card');
    cards.forEach(card => {
      card.addEventListener('click', (e) => {
        const role = e.currentTarget.dataset.role;
        this.selectRole(role);
      });

      // Quick double click can directly open login form
      card.addEventListener('dblclick', () => {
        this.openAuthStage();
      });
    });

    const continueBtn = document.getElementById('btn-launch-hero-portal');
    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        this.openAuthStage();
      });
    }
  }

  selectRole(role) {
    if (!['student', 'therapist', 'parent'].includes(role)) return;
    this.selectedRole = role;
    this.updateRoleSelectionUI(role);
    if (window.soundSFX) window.soundSFX.playPop();
  }

  updateRoleSelectionUI(role) {
    const loginCard = document.getElementById('hero-login-card');
    if (loginCard) {
      loginCard.className = `hero-login-card ${role}-mode`;
    }

    document.querySelectorAll('.role-character-card').forEach(card => {
      card.classList.toggle('active', card.dataset.role === role);
    });

    const continueBtn = document.getElementById('btn-launch-hero-portal');
    if (continueBtn) {
      const labels = {
        student: 'Continue to Sign In as Student Explorer →',
        therapist: 'Continue to Clinician Gateway →',
        parent: 'Continue to Sign In as Parent / Caregiver →'
      };
      continueBtn.innerHTML = `<span>🚀</span> <span>${labels[role]}</span>`;

      if (role === 'student') {
        continueBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)';
        continueBtn.style.boxShadow = '0 6px 0 #c2410c, 0 12px 24px rgba(234, 88, 12, 0.35)';
      } else if (role === 'therapist') {
        continueBtn.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
        continueBtn.style.boxShadow = '0 6px 0 #075985, 0 12px 24px rgba(2, 132, 199, 0.35)';
      } else {
        continueBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        continueBtn.style.boxShadow = '0 6px 0 #047857, 0 12px 24px rgba(16, 185, 129, 0.35)';
      }
    }
  }

  /* =========================================================
     STAGE 2: AUTHENTICATION STAGE (LOGIN & REGISTER)
     ========================================================= */
  openAuthStage() {
    const roleCard = document.getElementById('hero-login-card');
    const authCard = document.getElementById('hero-auth-card');
    if (!roleCard || !authCard) return;

    if (window.soundSFX) window.soundSFX.playPop();

    // Hide Stage 1, Show Stage 2
    roleCard.style.display = 'none';
    authCard.style.display = 'flex';
    authCard.className = `hero-auth-card ${this.selectedRole}-mode`;

    // Configure role pill
    const rolePillIcon = document.getElementById('auth-role-icon');
    const rolePillName = document.getElementById('auth-role-name');
    const roleMeta = {
      student: { icon: '🧒', name: 'Student Explorer Portal' },
      therapist: { icon: '🩺', name: 'Speech Clinician / SLP Gateway' },
      parent: { icon: '👨‍👩‍👦', name: 'Parent & Caregiver Portal' }
    };
    if (rolePillIcon) rolePillIcon.textContent = roleMeta[this.selectedRole].icon;
    if (rolePillName) rolePillName.textContent = roleMeta[this.selectedRole].name;

    // RESTRICTION: REGISTRATION IS FOR STUDENTS AND PARENTS ONLY (NOT FOR THERAPISTS)
    const registerTab = document.getElementById('tab-auth-register');
    const therapistNotice = document.getElementById('therapist-security-notice');

    if (this.selectedRole === 'therapist') {
      if (registerTab) registerTab.style.display = 'none'; // Absolutely no registration for therapists
      if (therapistNotice) therapistNotice.style.display = 'flex';
      this.switchAuthTab('signin');
    } else {
      if (registerTab) registerTab.style.display = 'inline-flex';
      if (therapistNotice) therapistNotice.style.display = 'none';
      this.switchAuthTab('signin');
    }

    // Adapt Form Labels
    this.adaptFormFieldsForRole();
    this.clearAuthInputs();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeAuthStage() {
    const roleCard = document.getElementById('hero-login-card');
    const authCard = document.getElementById('hero-auth-card');
    if (!roleCard || !authCard) return;

    if (window.soundSFX) window.soundSFX.playPop();

    authCard.style.display = 'none';
    roleCard.style.display = 'flex';

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setupAuthNavigation() {
    const backBtn = document.getElementById('btn-back-to-roles');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        this.closeAuthStage();
      });
    }
  }

  setupAuthTabs() {
    const signinTab = document.getElementById('tab-auth-signin');
    const registerTab = document.getElementById('tab-auth-register');

    if (signinTab) {
      signinTab.addEventListener('click', () => {
        this.switchAuthTab('signin');
      });
    }

    if (registerTab) {
      registerTab.addEventListener('click', () => {
        // Double check safeguard: registration is blocked for therapists
        if (this.selectedRole === 'therapist') return;
        this.switchAuthTab('register');
      });
    }
  }

  switchAuthTab(mode) {
    this.authMode = mode;
    const signinTab = document.getElementById('tab-auth-signin');
    const registerTab = document.getElementById('tab-auth-register');
    const signinForm = document.getElementById('form-auth-signin');
    const registerForm = document.getElementById('form-auth-register');

    if (signinTab) signinTab.classList.toggle('active', mode === 'signin');
    if (registerTab) registerTab.classList.toggle('active', mode === 'register');

    if (signinForm) signinForm.style.display = (mode === 'signin') ? 'flex' : 'none';
    if (registerForm) registerForm.style.display = (mode === 'register') ? 'flex' : 'none';

    if (window.soundSFX) window.soundSFX.playPop();
  }

  adaptFormFieldsForRole() {
    const signinIdLabel = document.getElementById('signin-identifier-label');
    const signinIdInput = document.getElementById('signin-identifier');
    const signinBtnLabel = document.getElementById('btn-submit-signin-label');
    const demoBtnLabel = document.getElementById('demo-autofill-label');
    const btnSubmitSignin = document.getElementById('btn-submit-signin');

    const regNameLabel = document.getElementById('register-name-label');
    const regExtraGroup = document.getElementById('register-extra-group');
    const regExtraLabel = document.getElementById('register-extra-label');
    const regExtraInput = document.getElementById('register-extra');
    const regEmailLabel = document.getElementById('register-email-label');
    const regBtnLabel = document.getElementById('btn-submit-register-label');
    const btnSubmitRegister = document.getElementById('btn-submit-register');

    const demo = this.demoCredentials[this.selectedRole];
    if (demoBtnLabel) demoBtnLabel.textContent = demo.label;

    if (this.selectedRole === 'student') {
      if (signinIdLabel) signinIdLabel.textContent = 'Learner Username or Email';
      if (signinIdInput) signinIdInput.placeholder = 'aarav@speech.edu';
      if (signinBtnLabel) signinBtnLabel.textContent = 'Sign In to Student Studio →';

      if (regNameLabel) regNameLabel.textContent = 'Learner Full Name';
      if (regExtraGroup) regExtraGroup.style.display = 'flex';
      if (regExtraLabel) regExtraLabel.textContent = 'Learner Age';
      if (regExtraInput) regExtraInput.placeholder = 'e.g. 6 years old';
      if (regEmailLabel) regEmailLabel.textContent = 'Guardian Contact Email';
      if (regBtnLabel) regBtnLabel.textContent = 'Create Student Account & Start Quest →';

      if (btnSubmitSignin) btnSubmitSignin.style.background = 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)';
      if (btnSubmitRegister) btnSubmitRegister.style.background = 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)';
    } else if (this.selectedRole === 'therapist') {
      if (signinIdLabel) signinIdLabel.textContent = 'Institutional SLP ID or Email';
      if (signinIdInput) signinIdInput.placeholder = 'dr.ritu@speechclinic.org';
      if (signinBtnLabel) signinBtnLabel.textContent = 'Secure Clinician Sign In →';

      if (btnSubmitSignin) btnSubmitSignin.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
    } else {
      if (signinIdLabel) signinIdLabel.textContent = 'Parent / Caregiver Email';
      if (signinIdInput) signinIdInput.placeholder = 'sharma.family@email.com';
      if (signinBtnLabel) signinBtnLabel.textContent = 'Sign In to Caregiver Hub →';

      if (regNameLabel) regNameLabel.textContent = 'Parent / Guardian Full Name';
      if (regExtraGroup) regExtraGroup.style.display = 'flex';
      if (regExtraLabel) regExtraLabel.textContent = "Child / Student's Name";
      if (regExtraInput) regExtraInput.placeholder = "e.g. Aarav Sharma";
      if (regEmailLabel) regEmailLabel.textContent = 'Primary Email Address';
      if (regBtnLabel) regBtnLabel.textContent = 'Create Parent Account & Connect Child →';

      if (btnSubmitSignin) btnSubmitSignin.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
      if (btnSubmitRegister) btnSubmitRegister.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    }
  }

  setupDemoAutofill() {
    const demoBtn = document.getElementById('btn-demo-autofill');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        const demo = this.demoCredentials[this.selectedRole];
        const idInput = document.getElementById('signin-identifier');
        const passInput = document.getElementById('signin-password');

        if (idInput) idInput.value = demo.identifier;
        if (passInput) passInput.value = demo.password;

        if (window.soundSFX) window.soundSFX.playPop();
        if (window.appState) {
          window.appState.showToast('⚡ Demo Auto-filled', `Loaded credentials for ${demo.name}`, 'standard');
        }
      });
    }
  }

  clearAuthInputs() {
    ['signin-identifier', 'signin-password', 'register-name', 'register-extra', 'register-email', 'register-password'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  setupFormSubmissions() {
    // 1. Sign In Form Submission
    const signinForm = document.getElementById('form-auth-signin');
    if (signinForm) {
      signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('signin-identifier')?.value.trim();
        const pass = document.getElementById('signin-password')?.value.trim();

        if (!id || !pass) {
          alert('Please enter your login username/email and password.');
          return;
        }

        this.completeLogin(this.selectedRole, id);
      });
    }

    // 2. Register Form Submission (Students and Parents ONLY)
    const registerForm = document.getElementById('form-auth-register');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Extra safeguard: prevent registration if therapist role
        if (this.selectedRole === 'therapist') {
          alert('Therapist accounts cannot self-register. Please contact hospital/clinic admin.');
          return;
        }

        const name = document.getElementById('register-name')?.value.trim();
        const email = document.getElementById('register-email')?.value.trim();
        const pass = document.getElementById('register-password')?.value.trim();

        if (!name || !email || !pass) {
          alert('Please complete all required registration fields.');
          return;
        }

        this.completeRegistration(this.selectedRole, name);
      });
    }
  }

  completeLogin(role, identifier) {
    if (window.appState) {
      window.appState.loginAs(role, identifier);
      this.closeAuthStage();
    }
  }

  completeRegistration(role, name) {
    if (window.appState) {
      window.appState.registerAndLogin(role, name);
      this.closeAuthStage();
    }
  }
}

// Instantiate global controller
window.heroController = new HeroPageController();
