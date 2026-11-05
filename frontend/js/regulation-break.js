/**
 * ArticuTwin - Pediatric Sensory Regulation Break Engine
 * Mindful breathing and calming mini-breaks triggered during struggle detection
 * to prevent emotional fatigue in children before clinical assistance arrives.
 */

window.RegulationBreak = {
  isOpen: false,
  timerInterval: null,
  secondsRemaining: 15,

  startBreak() {
    this.isOpen = true;
    this.secondsRemaining = 15;

    let modal = document.getElementById('regulation-break-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'regulation-break-modal';
      modal.className = 'regulation-modal-backdrop';
      modal.innerHTML = `
        <div class="regulation-modal-card">
          <div class="reg-icon">🎈</div>
          <h3>Take a Mindful Breath!</h3>
          <p>Great effort! Let's take 3 deep belly breaths together while Dr. Ritu prepares our demonstration video!</p>
          <div class="breathing-circle-container">
            <div class="breathing-circle" id="breathing-circle">Inhale... Exhale...</div>
          </div>
          <div class="reg-timer" id="reg-timer-text">Resuming in 15 seconds</div>
          <button class="btn-duo btn-blue btn-sm" onclick="window.RegulationBreak.endBreak()" style="margin-top: 14px;">
            I'm Ready to Continue! ✨
          </button>
        </div>
      `;
      document.body.appendChild(modal);
    }

    modal.style.display = 'flex';
    if (window.soundSFX) window.soundSFX.playPop();

    const circle = document.getElementById('breathing-circle');
    if (circle) circle.className = 'breathing-circle animate';

    const timerEl = document.getElementById('reg-timer-text');
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.secondsRemaining -= 1;
      if (timerEl) timerEl.textContent = `Resuming in ${this.secondsRemaining} seconds`;
      if (this.secondsRemaining <= 0) {
        this.endBreak();
      }
    }, 1000);
  },

  endBreak() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    const modal = document.getElementById('regulation-break-modal');
    if (modal) modal.style.display = 'none';
    this.isOpen = false;
  },
};
