BACKEND API & WEBSOCKET CONTRACT SPECIFICATION3D Articulation Speech Therapy Platform

Base URL: /api/v1/  |  Protocol: REST HTTP + WebSockets (WSS)Author: Backend Team (Rithika & Team)  |  Version: 1.0  |  Status: Production Spec

1. Architecture & Global Standards

• Base URL Prefix: /api/v1/

• Authentication: Bearer JWT in Authorization header (Authorization: Bearer <token>).

• Content-Type: application/json for all REST request/response payloads.

• Real-Time Transport: Socket.io / WebSocket server for bi-directional live events.

2. REST Endpoints Specification (22 Core + 1 Future)

#

Method & Endpoint

Payload / Query Params

Description & Response Contract

1

POST /auth/register

{ name, email, password, role }

Registers therapist, parent, or student user. Returns JWT & user object.

2

POST /auth/login

{ email, password }

Authenticates user credentials. Returns JWT token and role payload.

3

GET /students

?therapistId, ?search

Returns list of assigned students with age, active target phonemes, and status.

4

GET /students/:studentId

Path: studentId

Detailed student profile, assigned phoneme list, and parent details.

5

GET /phonemes

?category=sparsh

List of all Hindi phonemes (क, ख, ग...) with metadata and categorization.

6

GET /phonemes/:phonemeId

Path: phonemeId

Phoneme details, paired image asset URL (e.g. kabutar), and slowed audio URL.

7

GET /phonemes/:phonemeId/articulation-content

Path: phonemeId

Fetches 3D model mesh coordinates, 2D/3D airflow video URLs, and mouth posture metadata.

8

POST /practice/sessions

{ studentId, phonemeId }

Initializes a self-practice session record. Returns sessionId.

9

POST /practice/sessions/:sessionId/attempts

{ isSuccess, audioUrl, failureCount }

Logs a practice attempt. Increments failure counter. If failureCount == 5, triggers WebSocket alert.

10

GET /alerts

?status=active

Retrieves active student struggle alerts for the logged-in therapist.

11

GET /alerts/:alertId

Path: alertId

Returns detailed alert info: student name, phoneme, failed attempts count, timestamp.

12

POST /alerts/:alertId/unlock

{ sendNotification: true }

Unlocks 3D video content for student and emits THREE_D_UNLOCKED event.

13

POST /sessions

{ studentId, scheduledTime }

Creates a live therapy session slot.

14

POST /sessions/:sessionId/start

Path: sessionId

Starts live session and emits SESSION_STARTED event to student screen.

15

POST /sessions/:sessionId/push-content

{ contentId, type: '3D_AIRFLOW' }

Pushes 3D model/video mid-session. Emits CONTENT_PUSHED event.

16

POST /sessions/:sessionId/notes

{ notes, score, targetPhoneme }

Saves therapist session feedback notes and clinical score.

17

GET /parents/me/children

Header: Parent Bearer JWT

Lists all children linked to the authenticated parent user.

18

GET /students/:studentId/progress

Path: studentId

Returns phonetic mastery percentages, mastered list, and ongoing struggles.

19

GET /students/:studentId/practice-frequency

Path: studentId, ?range=30d

Returns daily practice activity timestamps for heatmap calendar rendering.

20

GET /diagnostics/:studentId

Path: studentId

Clinical diagnostic report containing acoustic analysis history and speech notes.

21

POST /audio/upload-url

{ fileName, fileType }

Generates an S3/Cloud storage presigned upload URL for audio recording.

22

POST /audio/complete

{ audioId, uploadPath }

Confirms audio file upload completion and links to attempt log.

23

POST /ml/evaluate (Future)

{ audioUrl, targetPhoneme }

Sends audio to AI/ML model for automated phonetic accuracy scoring.

3. Real-Time WebSockets Specification (6 Core Events)

#

Event Name

Emitter $\rightarrow$ Listener

Payload Structure & Description

1

STUDENT_FAILURE_THRESHOLD

Client (Student) $\rightarrow$ Server

{ studentId, phonemeId, count: 5 }Fires automatically when 5 consecutive speech attempts fail.

2

THERAPIST_ALERT_CREATED

Server $\rightarrow$ Client (Therapist)

{ alertId, studentId, studentName, phoneme }Fires immediately on therapist dashboard to show struggle alert.

3

THREE_D_UNLOCKED

Server $\rightarrow$ Client (Student & Parent)

{ studentId, phonemeId, videoUrl }Fires when therapist clicks unlock. Opens 3D video & alerts parent.

4

SESSION_STARTED

Server $\rightarrow$ Client (Student)

{ sessionId, therapistName, streamUrl }Notifies student that therapist launched live session.

5

CONTENT_PUSHED

Server $\rightarrow$ Client (Student)

{ sessionId, contentUrl, contentType: '3D_AIRFLOW' }Real-time push of 3D mouth model/video during live session.

6

PROGRESS_UPDATED

Server $\rightarrow$ Client (Parent & Therapist)

{ studentId, phonemeId, newStatus: 'MASTERED' }Broadcasts when phoneme mastery status updates.