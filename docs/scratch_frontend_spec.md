FRONTEND WORKFLOW & UI SPECIFICATION3D Articulation Speech Therapy Platform

Focus Area: Hindi Phonetics (हिन्दी वर्णमाला)  |  Roles: Therapist, Student, ParentCoordination: Nandhini, Rithika, Noorunnisa, Spurgen, Dharshini, Narean, Suriya  |  Front-end workflow document

1. Executive Summary & Context

This document defines the comprehensive frontend architecture, user experience (UX) workflows, page layouts, and interaction patterns for the 3D Articulation Speech Therapy Web Application. Designed specifically for pediatric speech language therapy targeting Hindi phonetics (हिन्दी वर्णमाला), the application facilitates interactive speech retraining through real-time 3D vocal tract visualizations, cadence-adjusted audio learning, automated struggle detection, and multi-stakeholder progress analytics.

LOGIC UPDATE: AUTOMATED 5-FAILURE TRIGGER: Includes the newly defined automated workflow where 5 consecutive failed pronunciations by a student trigger a therapist alert, enabling controlled 3D video session unlocks and parent notification.

2. Portal Breakdown & Page Hierarchy

The system is architected around three core user roles, each served by a dedicated portal with specialized workflows:

Portal / Role

Primary Pages

Core Focus & Purpose

Therapist Portal(Speech Language Pathologist)

1. Therapist Schedule Dashboard2. Live Articulation Studio

Schedule slot management, live session controls, receiving struggle alerts (5-failure rule), private 3D anatomy simulation, and controlled 3D video unlocks.

Student Portal(Pediatric User)

1. Phoneme Exploration Hub2. Interactive Practice Room

Gamified Hindi alphabet selection (क, ख, ग...), slowed phonetic audio playback, visual object pairing (कबूतर), automated failure tracking, and viewing therapist-unlocked 3D videos.

Parent Portal(Guardian / Caregiver)

1. Speech Trajectory Dashboard2. Home Practice & Notes Hub

Monitoring phonetic mastery, receiving 3D video unlock notifications, reviewing therapist session logs, and guiding home practice.

3. Page Specifications & UI Functionalities

3.1 Therapist Portal

Page 1: Therapist Schedule & Student Dashboard

• Use Case: Allows therapists to manage their daily clinical roster, view time slots, receive automated student struggle alerts, and track session histories.

Key Frontend Functionalities:

  - Time-Slot Grid View: Dynamic schedule displaying today's appointments, assigned student profiles, and session statuses (Upcoming, In-Progress, Completed).

  - Automated Struggle Alert Center (5-Failure Rule): Immediate notification banner alerting the therapist when a student fails 5 consecutive attempts at pronouncing a letter during independent practice.

  - One-Click 3D Video Push / Unlock: Action button directly inside the struggle notification drawer allowing the therapist to unlock the 3D articulation video for the child with one tap.

  - Student Search & Filter: Quick filtering by child name, target phonemes (e.g., struggling with velar sounds like 'क'), or alert state.

  - One-Click Session Launch: 'Start Session' action button that opens the Live Articulation Studio and sends a session invite to the student screen.

Page 2: Live Articulation Studio

• Use Case: Clinical workspace during live sessions or on-demand 3D guidance pushing when students face pronunciation roadblocks.

Key Frontend Functionalities:

  - Hindi Phoneme Palette: Interactive visual palette categorizing Hindi consonants and vowels (Sparsh, Anthastha, Ushma: क, ख, ग, घ, ङ, च...).

  - Private 3D Anatomical Articulation Hub: Interactive WebGL/3D viewport rendering a detailed mouth and vocal tract model showing tongue placement, lip position, and jaw orientation.

  - Airflow Simulation Controls: Toggles to display air intake vectors, pulmonary exhalation direction, nasal airflow vs. oral explosion.

  - Manual/Auto Triggered 'Push to Student': Controls to stream 3D/2D airflow animations to the student's screen either live or post-alert approval.

3.2 Student Portal

Page 1: Phoneme Exploration Hub

• Use Case: Child-friendly grid where students choose practice targets or view therapist-unlocked 3D lessons.

Key Frontend Functionalities:

  - Interactive Tile Matrix: Bright tile grid representing Hindi letters (क, ख, ग, घ, य, र, ल, व...).

  - Unlocked 3D Video Badges: Special visual indicator on letter tiles showing when a 3D guided video has been unlocked by the therapist.

  - Audio Hover Preview: Playful audio snippet of the letter sound when hovering or tapping.

Page 2: Interactive Practice Room

• Use Case: Stage where students practice pronunciation, receive cadence audio, and access therapist-unlocked 3D articulation videos.

Key Frontend Functionalities:

  - Prominent Letter & Object Association: High-visibility rendering of target letter paired with imagery (e.g., 'क' → 'कबूतर').

  - Consecutive Attempt Counter & Failure Tracker: Client-side tracking mechanism monitoring speech attempts. Tracks 5 continuous incorrect attempts/failures on a specific letter.

  - Automated Alert Triggering: On the 5th consecutive failure, triggers a background alert to the therapist asking for 3D visual support.

  - Slow-Paced Phonetic Audio Engine: Audio player with cadence control allowing slow-motion phonetic playback (e.g., 'Ka... bu... tar').

  - Dynamic 3D/2D Video Player Window: Displays therapist-pushed 3D tongue and airflow videos demonstrating how to pronounce the letter correctly.

3.3 Parent Portal

Page 1: Speech Trajectory & Progress Analytics Dashboard

• Use Case: Empowers parents with clear insight into their child's progress, struggle alerts, and unlocked 3D sessions.

Key Frontend Functionalities:

  - '3D Video Session Unlocked' Notification: Prompt notifying the parent that the therapist has unlocked a 3D visual articulation module due to child struggle.

  - Phoneme Completion Progress Bar: Visual breakdown of mastered, ongoing, and struggling Hindi letter groups.

  - Practice Frequency Calendar: Heatmap calendar showing daily practice sessions and struggle points.

Page 2: Home Practice & Therapist Notes Hub

• Use Case: Central hub for parents to view therapist notes and launch assigned 3D practice sessions.

Key Frontend Functionalities:

  - Direct Unlocked 3D Session Launcher: Dedicated quick button for parents to open and guide their child through therapist-unlocked 3D videos at home.

  - Post-Session Feedback Feed: Summary notes from therapists following live sessions.

4. End-to-End User UX Workflows

The following workflows outline the step-by-step user experience including both standard live sessions and the automated 5-failure assist loop.

Phase / Trigger

Therapist Action

Student Action / UI Response

Parent Insight

1. Independent Student Practice

N/A (Monitors dashboard asynchronously).

Selects letter 'क', listens to slow audio 'Ka...bu...tar', and attempts spoken practice.

Can view practice log on mobile dashboard.

2. Struggle Detection (5 Continuous Failures)

Receives automated push notification: 'Student X failed letter 'क' 5 times continuously'. Click to unlock 3D guide.

System flags the struggle point on the 5th attempt and pauses repetition cycle. Displays 'Therapist Alerted' indicator.

Receives alert: 'Child encountered difficulty with 'क'. Therapist notified.'

3. Therapist 3D Video Push

Reviews struggle alert, opens 3D preview, and clicks 'Push / Unlock 3D Video Session'.

Screen updates immediately with 3D anatomical video showing air intake/exhalation for letter 'क'.

Receives notification: '3D Video Session is now OPEN for letter 'क''.

4. Assisted Practice & Resolution

Monitors child's updated score after watching the 3D video.

Watches 3D/2D airflow video, learns correct tongue/breath technique, and re-attempts pronunciation.

Views progress update confirming successful attempt after 3D assistance.

5. UI/UX Design & Frontend Technical Guidelines

• 5-Failure State Management: Client-side event listener that increments failure counts on failed audio evaluations and triggers automated socket alerts on count == 5.

• Pediatric Accessibility: Large touch targets, soft warm rounded cards, gentle failure feedback (no harsh red error screens) for young children.

• Real-Time Alert System: WebSockets / Push Notifications alerting therapists immediately when students trigger struggle thresholds during offline/practice modes.

• Responsive Multi-Device Support: Seamless operation across child-friendly tablets, therapist desktops, and parent mobile browsers.