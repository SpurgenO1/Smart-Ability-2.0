/**
 * Smart Articulation Training System - Real-Time WebSocket Gateway
 * Connects to EchoSeed Socket.IO server at path /ws with JWT authentication.
 * Listens for struggle alerts, therapist video unlocks, and live session sync.
 */

class EchoSeedSocketClient {
  constructor(serverUrl) {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:4000';
    this.serverUrl = serverUrl || (origin.includes(':4000') ? origin : 'http://localhost:4000');
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket && this.isConnected) return;

    const token = window.apiClient?.accessToken;
    if (!token) {
      console.log('[SocketClient] No access token available, skipping socket connection.');
      return;
    }

    if (typeof io === 'undefined') {
      console.warn('[SocketClient] Socket.io client library not loaded.');
      return;
    }

    try {
      this.socket = io(this.serverUrl, {
        path: '/ws',
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('⚡ [SocketClient] Connected to real-time EchoSeed gateway (ID: ' + this.socket.id + ')');
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        console.log('🔌 [SocketClient] Disconnected:', reason);
      });

      this.socket.on('connect_error', (err) => {
        console.warn('⚠️ [SocketClient] Connection error:', err.message);
      });

      this.setupCoreEventHandlers();
    } catch (err) {
      console.error('[SocketClient] Failed to initialize Socket.IO:', err);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  reconnect() {
    this.disconnect();
    this.connect();
  }

  setupCoreEventHandlers() {
    if (!this.socket) return;

    // 1. Struggle Alert Created (Server -> Clinician)
    this.socket.on('THERAPIST_ALERT_CREATED', (data) => {
      console.log('🚨 [SocketClient] Received THERAPIST_ALERT_CREATED:', data);

      if (window.soundSFX) window.soundSFX.playAlertNotification();

      const alertRecord = {
        id: data.alertId,
        studentId: data.studentId,
        studentName: data.studentName || 'Student',
        phonemeId: data.phoneme,
        phonemeSymbol: data.phoneme,
        phonemeName: `Phoneme ${data.phoneme}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        consecutiveFailures: data.failureCount || 5,
        resolved: false,
      };

      if (window.appState) {
        window.appState.addStruggleAlert(alertRecord);
        window.appState.showToast(
          '🚨 Student Struggle Alert (5-Failure Rule)',
          `${alertRecord.studentName} failed 5 trials on '${alertRecord.phonemeSymbol}'. Clinical video requested!`,
          'alert'
        );
      }
    });

    // 2. Video Demonstration Unlocked (Server -> Student & Parent)
    this.socket.on('THREE_D_UNLOCKED', (data) => {
      console.log('🔓 [SocketClient] Received THREE_D_UNLOCKED:', data);

      if (window.soundSFX) window.soundSFX.playUnlockCheer();

      if (window.appState) {
        window.appState.unlockPhoneme3D(data.phonemeId, data.videoUrl);
        window.appState.showToast(
          '🔓 Clinical Demonstration Video Unlocked!',
          `Dr. Ritu Nair has unlocked the clinical demonstration video for your sound!`,
          'unlock'
        );
      }

      // Automatically play/switch to video in Student View if active
      if (window.studentController && window.studentController.setDemonstrationVideo) {
        const videoUrl = data.videoUrl || 'assets/videos/vowel_1.mp4';
        window.studentController.setDemonstrationVideo(videoUrl);
      }
    });

    // 3. Live Session Started (Server -> Student)
    this.socket.on('SESSION_STARTED', (data) => {
      console.log('🎥 [SocketClient] Received SESSION_STARTED:', data);

      if (window.soundSFX) window.soundSFX.playCorrect();

      if (window.appState) {
        window.appState.showToast(
          '🎥 Live Articulation Session Ready',
          `Dr. Ritu Nair has launched your live articulation session!`,
          'standard'
        );
      }
    });

    // 4. Content Pushed by Clinician Mid-Session (Server -> Student)
    this.socket.on('CONTENT_PUSHED', (data) => {
      console.log('📡 [SocketClient] Received CONTENT_PUSHED:', data);

      if (window.soundSFX) window.soundSFX.playPop();

      if (window.studentController && window.studentController.setDemonstrationVideo) {
        const videoUrl = data.contentUrl || 'assets/videos/asha.mp4';
        window.studentController.setDemonstrationVideo(videoUrl);
      }

      if (window.appState) {
        window.appState.showToast(
          '📡 Clinical Content Streamed',
          `Therapist pushed a new demonstration module to your practice screen!`,
          'standard'
        );
      }
    });

    // 5. Progress Updated (Server -> Parent & Therapist)
    this.socket.on('PROGRESS_UPDATED', (data) => {
      console.log('📈 [SocketClient] Received PROGRESS_UPDATED:', data);

      if (window.parentController && window.parentController.renderProgressBars) {
        window.parentController.renderProgressBars();
      }
    });
  }

  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`[SocketClient] Socket not connected. Dropping event: ${event}`);
    }
  }
}

// Global real-time socket client
window.socketClient = new EchoSeedSocketClient();
