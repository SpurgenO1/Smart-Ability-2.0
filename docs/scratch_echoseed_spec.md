ECHOSEED

Backend Contract & API Specification

3D Articulation Speech Therapy Platform — Hindi Phonetics (हिन्दी वर्णमाला)

Backend architecture, full REST API contract, real-time events, database schema, security, and compliance requirements. Frontend UI/UX content is intentionally excluded from this document.

Version 1.0 — Backend Architecture Draft

1. Purpose of This Document

This document defines the backend contract for EchoSeed. The backend is responsible for:

User authentication and authorization

Managing Therapist, Student, and Parent accounts

Managing student profiles and Hindi phoneme/letter content

Managing practice sessions and pronunciation attempts

Recording and evaluating attempt results

Maintaining consecutive failure counts and triggering the 5-failure therapist alert

Managing therapist 3D-video unlocks and sending real-time notifications

Storing therapist session notes and maintaining student progress history

Providing analytics to parents and therapists

Separating identifying information from clinical/practice data

Providing APIs consumed by the frontend

The backend is responsible for persistent data, business rules, authorization, event processing, and synchronization between users. Frontend presentation, interaction, and client-side rendering are out of scope for this document.

2. System Architecture

2.1 High-Level Architecture

Figure 1 — Client apps connect over HTTPS/WSS to a single API server, which coordinates the database, object storage, and real-time gateway.

2.2 Recommended Technology

Layer

Recommendation

Backend runtime

Node.js, Express.js or Fastify, REST API, WebSocket/Socket.IO for real-time events

Database

PostgreSQL (preferred — strongly related entities); MongoDB acceptable for early prototype only

Authentication

JWT-based, refresh-token mechanism, Argon2 or bcrypt password hashing, role-based authorization

File storage

AWS S3 / Cloudflare R2 / Supabase Storage — audio and media NOT stored in the database, only metadata + secure references

Real-time

WebSocket / Socket.IO for therapist alerts, session updates, unlock notifications

3. User Roles

3.1 Therapist

View assigned students, schedules, and practice history

Receive struggle alerts; review failed attempts and phoneme performance

Open the 3D articulation studio; unlock 3D guidance

Start live sessions; send guidance to a student; add session notes; review progress

3.2 Student

View assigned phonemes; explore Hindi letters; listen to pronunciation audio

Start practice sessions; submit pronunciation attempts; receive evaluation results

View therapist-unlocked 3D guidance; continue assisted practice; view personal progress

3.3 Parent

View child's progress, practice frequency, and struggle events

Receive 3D unlock notifications; view therapist notes; launch home-practice sessions

4. Authentication Contract

POST /api/v1/auth/register

Request:

{ "name": "Example User", "email": "user@example.com",

  "password": "secure-password", "role": "therapist" }

Allowed roles: therapist | parent | student

 

Response:

{ "success": true, "data": { "userId": "usr_12345", "name": "Example User", "role": "therapist" } }

POST /api/v1/auth/login

Request:  { "email": "user@example.com", "password": "secure-password" }

Response:

{ "success": true, "data": {

    "accessToken": "JWT_TOKEN", "refreshToken": "REFRESH_TOKEN",

    "user": { "id": "usr_12345", "name": "Example User", "role": "therapist" }

}}

4.1 Authentication Rules

Every protected API request must contain: Authorization: Bearer <access_token>

The backend must validate: token validity, token expiration, user existence, account status, user role, and resource ownership/assignment. A student must never be able to access another student's data simply by changing an ID in the API request.

5. Student Management

GET /api/v1/students — filters: ?phoneme=क  ?status=struggling  ?search=name

{ "success": true, "data": [{

    "studentId": "stu_001", "displayName": "Student A",

    "status": "struggling", "activeAlerts": 1, "currentTargets": ["क", "ख"] }] }

GET /api/v1/students/:studentId

{ "success": true, "data": {

    "studentId": "stu_001", "displayName": "Student A",

    "assignedTherapist": "therapist_001", "targetPhonemes": ["क", "ख", "ग"],

    "progress": { "mastered": 8, "ongoing": 3, "struggling": 2 } } }

6. Hindi Phoneme API

The backend provides phoneme content as metadata — it must not be hard-coded in any client.

GET /api/v1/phonemes

{ "id": "ph_k", "character": "क", "name": "Ka", "category": "Sparsh",

  "exampleWord": "कबूतर", "exampleMeaning": "Pigeon", "audioUrl": "/media/phonemes/ka.mp3",

  "articulation": { "tongue": "back elevation", "lips": "neutral", "jaw": "neutral", "airflow": "oral" } }

GET /api/v1/phonemes/:phonemeId — full articulation detail

{ "id": "ph_k", "character": "क", "name": "Ka", "category": "Sparsh",

  "audio": { "normal": "/media/ka-normal.mp3", "slow": "/media/ka-slow.mp3" },

  "articulation": { "tonguePosition": "velar", "lipPosition": "neutral",

                     "jawPosition": "neutral", "airflowDirection": "oral" },

  "video": { "available": true, "previewUrl": "/media/ka-preview.mp4" } }

7. Practice Sessions & Attempt Evaluation

POST /api/v1/practice/sessions

Request:  { "studentId": "stu_001", "phonemeId": "ph_k", "mode": "independent" }

Response: { "sessionId": "prs_1001", "status": "active", "startedAt": "..." }

POST /api/v1/practice/sessions/:sessionId/attempts

Request:

{ "attemptNumber": 1, "targetPhoneme": "क", "recognizedText": "क",

  "recognitionConfidence": 0.87,

  "audioFeatures": { "durationMs": 740, "dominantFrequency": 1250, "spectralCentroid": 1820 },

  "mouthFeatures": { "mouthOpenRatio": 0.32, "lipSpread": 0.41, "jawPosition": 0.27 } }

 

Response:

{ "attemptId": "att_001", "result": "pass",

  "consecutiveFailures": 0, "therapistAlertTriggered": false }

7.1 Evaluation Pipeline

Figure 2 — Every attempt runs through speech recognition, audio and mouth feature analysis, and rule-based evaluation before the failure counter updates.

8. Five-Consecutive-Failure Rule

This is one of the primary backend business rules.

failureCount += 1

if failureCount < 5  -> continue normal practice

if failureCount == 5 -> the backend must:

  1. Create a struggle alert

  2. Associate the alert with the student and the phoneme

  3. Record the triggering attempt

  4. Notify the assigned therapist

  5. Notify the parent if configured

  6. Mark the practice state as therapist_review_required

  7. Prevent duplicate alerts for the same five-failure sequence

 

PASS -> failureCount = 0   (the counter is CONSECUTIVE, not cumulative)

 

Example:

FAIL->1  FAIL->2  PASS->0  FAIL->1  FAIL->2  FAIL->3  FAIL->4  FAIL->5 -> ALERT

Critical implementation requirement

The backend must NOT blindly trust a client-provided failure count. The client should never send { "failureCount": 5 } and expect the server to trust it. The server must calculate the consecutive count from the stored attempt sequence — this is the single most important rule in this entire specification, since it's what makes the alert system tamper-resistant and reliable when a client goes offline or has a bug.

8.1 Alert Flow

Figure 3 — The full alert loop across Student, Backend, Therapist, and Parent, including the two WebSocket events that drive it.

9. Struggle Alert & 3D Unlock APIs

GET /api/v1/alerts

{ "alertId": "alt_001", "studentId": "stu_001", "studentName": "Student A",

  "phoneme": "क", "failureCount": 5, "severity": "struggle",

  "status": "pending", "createdAt": "..." }

GET /api/v1/alerts/:alertId

{ "alertId": "alt_001", "phoneme": "क", "failureCount": 5,

  "triggerAttemptId": "att_005", "recentAttempts": [ 5 fail records ], "status": "pending" }

POST /api/v1/alerts/:alertId/unlock

Request:  { "contentId": "3d_ka_001", "message": "Practice tongue position using the 3D guide." }

Response: { "unlockId": "unl_001", "studentId": "stu_001", "phonemeId": "ph_k",

  "contentId": "3d_ka_001", "status": "active", "unlockedBy": "therapist_001" }

Frontend then receives real-time event: 3D_SESSION_UNLOCKED

GET /api/v1/phonemes/:phonemeId/articulation-content

{ "phoneme": "क", "modelUrl": "/models/ka-mouth.glb",

  "animationUrl": "/animations/ka-articulation.json", "videoUrl": "/videos/ka-articulation.mp4",

  "airflow": { "enabled": true, "direction": "oral", "nasal": false },

  "tongue": { "position": "velar", "elevation": "high" } }

10. Live Sessions & Notes

POST /api/v1/sessions

  { "studentId": "stu_001", "type": "live_articulation" } -> { "status": "waiting_for_student" }

POST /api/v1/sessions/:sessionId/start -> { "status": "in_progress" }  [event: THERAPIST_SESSION_STARTED]

POST /api/v1/sessions/:sessionId/push-content

  { "contentType": "3d_articulation", "contentId": "3d_ka_001", "phonemeId": "ph_k" }

POST /api/v1/sessions/:sessionId/notes

  { "note": "...", "recommendation": "Continue slow-paced practice for क." }

11. Parent & Progress Analytics

GET /api/v1/parents/me/children  |  GET /api/v1/students/:studentId/progress

{ "studentId": "stu_001",

  "phonemes": { "mastered": 8, "ongoing": 3, "struggling": 2 },

  "practice": { "totalSessions": 24, "totalAttempts": 186, "successfulAttempts": 141 },

  "generalizationScore": 72 }

GET /api/v1/students/:studentId/practice-frequency

[ { "date": "2026-09-01", "sessions": 2, "attempts": 14 },

  { "date": "2026-09-02", "sessions": 1, "attempts": 8 } ]

Mastery status configuration (must NOT be hard-coded)

{ "masteryThreshold": 0.85, "minimumAttempts": 10 }

-- This is an ENGINEERING threshold, not a clinical claim.

-- Final clinical thresholds must be defined/approved by a qualified SLP.

Generalization Score progression

Isolated Sound -> Syllable -> Word -> Phrase -> Sentence -> Connected Speech

{ "phoneme": "क", "levels": {

    "isolated": 0.95, "syllable": 0.88, "word": 0.81, "phrase": 0.74, "sentence": 0.68 } }

12. Root-Cause Diagnostic API

GET /api/v1/diagnostics/:studentId

{ "studentId": "stu_001", "suspectedFeatures": [{

    "feature": "tongue_tip_control", "confidence": 0.82,

    "affectedPhonemes": ["त", "द", "न"] }] }

Articulatory Feature Knowledge Base (example entries)

{ "phoneme": "क", "features": { "place": "velar", "tongue": "dorsum",

    "lip": "neutral", "jaw": "neutral", "airflow": "oral" } }

{ "phoneme": "न", "features": { "place": "alveolar", "tongue": "tip",

    "lip": "neutral", "jaw": "neutral", "airflow": "nasal" } }

Diagnostic Engine Pipeline

Attempt history + Audio features + Mouth features + Phoneme features

  -> Feature comparison -> Threshold/rule evaluation

  -> Candidate articulatory causes -> Confidence calculation

  -> Explainable diagnostic result (stores EVIDENCE, not just a label)

Compensatory Pass

Audio evaluation PASS + Mouth/articulation evaluation INCORRECT = not automatically a clinical diagnosis. Stored for therapist review:

{ "audioResult": "pass", "visualResult": "deviation_detected",

  "combinedResult": "compensatory_pass_candidate" }

13. Audio Upload Contract

A two-step upload process keeps large audio files off the main API server.

Step 1: POST /api/v1/audio/upload-url

Response: { "uploadUrl": "SIGNED_UPLOAD_URL", "fileId": "aud_001", "expiresIn": 300 }

 

Step 2: Frontend uploads audio directly to object storage.

 

Step 3: POST /api/v1/audio/complete

{ "fileId": "aud_001", "sessionId": "prs_1001", "attemptId": "att_001" }

Audio Metadata

{ "fileId": "aud_001", "format": "webm", "durationMs": 740,

  "sampleRate": 48000, "channels": 1, "sizeBytes": 48120, "createdAt": "..." }

-- Do not store raw audio permanently without a defined reason, consent,

-- retention policy, and appropriate security controls.

14. Real-Time WebSocket Contract

Connection: wss://api.echoseed.example/ws — after authentication, users join role-specific rooms (therapist:therapist_001, student:stu_001, parent:parent_001).

Event

Fired When

Payload (key fields)

STUDENT_FAILURE_THRESHOLD

5 consecutive failures reached

alertId, studentId, phoneme, failureCount

THERAPIST_ALERT_CREATED

New struggle alert created

alertId, studentId, phoneme

THREE_D_UNLOCKED

Therapist unlocks 3D content

unlockId, phonemeId, contentId

SESSION_STARTED

Live session begins

sessionId

CONTENT_PUSHED

Therapist pushes content mid-session

sessionId, contentId

PROGRESS_UPDATED

Mastery status changes

studentId, phonemeId, masteryStatus

15. Database Structure

Figure 4 — Simplified entity relationships across identity, phoneme content, and practice/clinical data.

15.1 Data Separation Principle

Identity Data                    Practice / Clinical Data

--------------                    -------------------------

name                               phoneme attempts

email                               audio features

date of birth                      mouth features

parent relationship                diagnostic results

                                    progress

                                    therapist notes

 

Connected only via internal student_id references.

This reduces unnecessary exposure of identifying information.

16. Authorization Matrix

Feature

Therapist

Student

Parent

Own profile

Yes

Yes

Yes

View assigned students

Yes

No

Own child only

Start practice

No

Yes

No

Submit attempt

No

Yes

No

View own progress

Yes

Yes

Own child

View alerts

Yes

Own status only

Own child

Unlock 3D

Yes

No

No

Push 3D content

Yes

No

No

Start live session

Yes

Accept

No

Add therapist notes

Yes

No

No

View therapist notes

Own records

Approved records

Own child

Manage phoneme content

Admin/Therapist

No

No

17. Security, Privacy & Compliance

17.1 Authentication & Authorization

Passwords never stored as plain text — Argon2 or bcrypt

Short-lived access tokens, refresh-token rotation

Every resource request verifies ownership/assignment — never trust a client-supplied studentId, parentId, or therapistId without server-side checks

17.2 Audio Security

HTTPS everywhere; encrypted object storage; signed URLs for private files

No permanent public audio URLs; retention policy; delete recordings when no longer required

Audit record for sensitive access where appropriate

17.3 Audit Logging

Logged actions: LOGIN, STUDENT_VIEW, ALERT_VIEW, THREE_D_UNLOCK,

  SESSION_START, NOTE_CREATED, AUDIO_ACCESS, PROFILE_UPDATED

 

{ "userId": "therapist_001", "action": "THREE_D_UNLOCK",

  "resourceId": "unl_001", "timestamp": "2026-09-10T11:00:00Z" }

17.4 Rate Limiting

Login:            5 failed attempts / minute / IP

General API:      100 requests / minute / user

Practice attempt:  reasonable application-specific limit

File upload:       size and frequency limits

17.5 Clinical Safety Boundary

Terminology Requirement

The backend must not represent automated results as definitive medical diagnoses unless the system has undergone required clinical validation and regulatory assessment. Prefer: evaluation, result, candidate, suspected feature, confidence, recommendation, therapist review. Avoid: medical diagnosis, confirmed disorder, clinical diagnosis — unless appropriately validated.

17.6 Children's Data & Privacy

Parent/guardian consent workflows where applicable

Data minimization, encryption in transit and at rest, access control

Defined data retention and deletion workflow

Legal/compliance review for the deployment jurisdiction before real-world deployment

The prototype must clearly distinguish itself from a production clinical platform until that review is complete

18. Development Phases

Phase

Scope

1. Backend Foundation

Node.js server, PostgreSQL, authentication, user roles, basic API structure, environment configuration

2. Student Practice

Phoneme API, practice sessions, attempt storage, failure counter (server-side), basic progress

3. Therapist Workflow

Therapist-student assignment, alert API, five-failure trigger, therapist dashboard APIs, 3D unlock

4. Real-Time System

WebSocket, therapist alerts, student unlock notifications, session events, parent notifications

5. Analytics

Progress aggregation, practice frequency, mastery tracking, generalization tracking

6. Diagnostic Engine

Articulatory feature knowledge base, audio/mouth feature evaluation, explainable rule engine, root-cause clustering

7. ML Integration (future)

Labeled speech dataset -> preprocessing -> wav2vec2 fine-tuning -> validation -> classifier -> inference API. Represent as implemented ONLY after the model is actually trained, evaluated, and validated.

18.1 Future ML API (not yet built)

POST /api/v1/ml/evaluate

Request:  { "attemptId": "att_001", "audioFileId": "aud_001" }

Response: { "predictedPhoneme": "क", "classification": "correct",

  "confidence": 0.91, "modelVersion": "wav2vec2-v1" }

-- Backend must store the model version used per prediction for reproducibility.

19. Definition of Done — Backend MVP

Authentication

Registration works · Login works · JWT auth works · Role-based authorization works

Student

Student profile API · Phoneme API · Practice session API · Attempt API

Five-Failure Engine

Failure count calculated server-side · Consecutive failures tracked · PASS resets counter · 5th consecutive failure creates an alert · Duplicate alerts prevented

Therapist

Alerts appear · Alert details accessible · Can unlock 3D content · Can start sessions · Can add notes

Student-side events

Receives unlocked-content event · Can access unlocked 3D content · New attempts stored

Parent

Can access child's permitted progress · Practice frequency available · Unlock notifications work · Therapist notes available where permitted

Security

HTTPS · Password hashing · Authorization checks · Private audio storage · Signed file URLs · Rate limiting · Audit logging

20. Final Architectural Principle

The frontend should display and interact; the backend should validate, remember, authorize, and coordinate. The child interacts with the frontend. The therapist manages the intervention. The parent observes approved progress. The backend connects all three roles while maintaining a single reliable source of truth.

Practice -> Detect -> Alert -> Review -> Assist -> Re-practice -> Measure Progress

Document Control

Any change to an API endpoint, request/response schema, authentication method, event name, database relationship, or business rule should be documented here before being implemented.

Version: 1.0 — Status: Backend Architecture Draft