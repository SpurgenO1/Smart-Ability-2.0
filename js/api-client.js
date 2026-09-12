/**
 * Smart Articulation Training System - EchoSeed REST API Client
 * Enterprise-grade client with Bearer JWT injection, auto-refresh token rotation,
 * full coverage for all 22 core clinical endpoints, and robust error handling.
 */

class EchoSeedApiClient {
  constructor(baseUrl) {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:4000';
    this.baseUrl = baseUrl || (origin.includes(':4000') ? `${origin}/api/v1` : 'http://localhost:4000/api/v1');
    this.accessToken = localStorage.getItem('echoseed_access_token') || null;
    this.refreshToken = localStorage.getItem('echoseed_refresh_token') || null;
    this.currentUser = JSON.parse(localStorage.getItem('echoseed_user') || 'null');
    this.refreshPromise = null;
  }

  setTokens(access, refresh, user) {
    this.accessToken = access;
    this.refreshToken = refresh;
    this.currentUser = user;

    if (access) localStorage.setItem('echoseed_access_token', access);
    else localStorage.removeItem('echoseed_access_token');

    if (refresh) localStorage.setItem('echoseed_refresh_token', refresh);
    else localStorage.removeItem('echoseed_refresh_token');

    if (user) localStorage.setItem('echoseed_user', JSON.stringify(user));
    else localStorage.removeItem('echoseed_user');
  }

  clearTokens() {
    this.setTokens(null, null, null);
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
      config.body = JSON.stringify(options.body);
    }

    let response;
    try {
      response = await fetch(url, config);
    } catch (networkError) {
      console.warn(`[ApiClient] Network connection failed for ${endpoint}:`, networkError);
      throw {
        status: 0,
        code: 'NETWORK_ERROR',
        message: 'Could not connect to backend server. Ensure backend is running on port 4000.',
      };
    }

    // Handle token expiration & automatic refresh
    if (response.status === 401 && this.refreshToken && !options._isRetry) {
      try {
        await this.rotateRefreshToken();
        // Retry original request with new token
        options._isRetry = true;
        return await this.request(endpoint, options);
      } catch (refreshErr) {
        this.clearTokens();
        if (window.appState) {
          window.appState.showToast('Session Expired', 'Please sign in again.', 'alert');
          window.appState.switchRole('hero');
        }
        throw refreshErr;
      }
    }

    let data;
    try {
      data = await response.json();
    } catch {
      data = { success: response.ok, statusText: response.statusText };
    }

    if (!response.ok) {
      const errPayload = data.error || {
        code: `HTTP_${response.status}`,
        message: data.message || response.statusText || 'API Request Failed',
      };
      throw {
        status: response.status,
        ...errPayload,
      };
    }

    return data.data !== undefined ? data.data : data;
  }

  async rotateRefreshToken() {
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        const res = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error('Refresh token invalid');
        }
        this.setTokens(data.data.accessToken, data.data.refreshToken, this.currentUser);
        return data.data.accessToken;
      })().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  /* =========================================================
     1. AUTHENTICATION (POST /auth/login, /auth/register, /auth/refresh)
     ========================================================= */
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    this.setTokens(data.accessToken, data.refreshToken, data.user);
    return data;
  }

  async register(registrationData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: registrationData,
    });
    return data;
  }

  async logout() {
    this.clearTokens();
  }

  /* =========================================================
     2. STUDENTS (GET /students, GET /students/:id, progress, frequency)
     ========================================================= */
  async getStudents(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/students${query ? `?${query}` : ''}`);
  }

  async getStudent(studentId) {
    return this.request(`/students/${studentId}`);
  }

  async getStudentProgress(studentId) {
    return this.request(`/students/${studentId}/progress`);
  }

  async getPracticeFrequency(studentId, range = '30d') {
    return this.request(`/students/${studentId}/practice-frequency?range=${range}`);
  }

  /* =========================================================
     3. PHONEMES (GET /phonemes, GET /phonemes/:id, articulation-content)
     ========================================================= */
  async getPhonemes(category = '') {
    const qs = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request(`/phonemes${qs}`);
  }

  async getPhoneme(phonemeId) {
    return this.request(`/phonemes/${phonemeId}`);
  }

  async getArticulationContent(phonemeId) {
    return this.request(`/phonemes/${phonemeId}/articulation-content`);
  }

  /* =========================================================
     4. PRACTICE SESSIONS & ATTEMPTS (5-FAILURE RULE ENGINE)
     ========================================================= */
  async startPracticeSession(studentId, phonemeId, mode = 'self_practice') {
    return this.request('/practice/sessions', {
      method: 'POST',
      body: { studentId: Number(studentId), phonemeId: Number(phonemeId), mode },
    });
  }

  async submitPracticeAttempt(sessionId, attemptInput) {
    return this.request(`/practice/sessions/${sessionId}/attempts`, {
      method: 'POST',
      body: attemptInput,
    });
  }

  /* =========================================================
     5. STRUGGLE ALERTS & VIDEO UNLOCKS
     ========================================================= */
  async getStruggleAlerts(status = 'active') {
    return this.request(`/alerts?status=${status}`);
  }

  async getAlertDetails(alertId) {
    return this.request(`/alerts/${alertId}`);
  }

  async unlockContent(alertId, payload = { sendNotification: true }) {
    return this.request(`/alerts/${alertId}/unlock`, {
      method: 'POST',
      body: payload,
    });
  }

  /* =========================================================
     6. LIVE THERAPY SESSIONS & CLINICAL NOTES
     ========================================================= */
  async createTherapySession(studentId, scheduledTime = new Date().toISOString()) {
    return this.request('/sessions', {
      method: 'POST',
      body: { studentId: Number(studentId), scheduledTime },
    });
  }

  async startTherapySession(sessionId) {
    return this.request(`/sessions/${sessionId}/start`, {
      method: 'POST',
    });
  }

  async pushSessionContent(sessionId, contentId, type = 'CLINICAL_VIDEO') {
    return this.request(`/sessions/${sessionId}/push-content`, {
      method: 'POST',
      body: { contentId, type },
    });
  }

  async saveSessionNotes(sessionId, { notes, score, targetPhoneme }) {
    return this.request(`/sessions/${sessionId}/notes`, {
      method: 'POST',
      body: { notes, score, targetPhoneme },
    });
  }

  /* =========================================================
     7. PARENTS & DIAGNOSTICS
     ========================================================= */
  async getParentChildren() {
    return this.request('/parents/me/children');
  }

  async getStudentDiagnostics(studentId) {
    return this.request(`/diagnostics/${studentId}`);
  }

  /* =========================================================
     8. AUDIO RECORDING UPLOAD (PRESIGNED URL WORKFLOW)
     ========================================================= */
  async requestAudioUploadUrl(metadata = {}) {
    return this.request('/audio/upload-url', {
      method: 'POST',
      body: metadata,
    });
  }

  async completeAudioUpload(fileId, uploadPath, sessionId, attemptId) {
    return this.request('/audio/complete', {
      method: 'POST',
      body: { fileId, uploadPath, sessionId, attemptId },
    });
  }
}

// Global API client instance
window.apiClient = new EchoSeedApiClient();
