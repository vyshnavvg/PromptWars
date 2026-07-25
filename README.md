# AnchorCare AI

AnchorCare AI is an emergency-first crisis support web application built for Prompt Wars 2026. It provides a cognitive-zero flow for people under stress, combines structured emergency actions with guided breathing, and supports both Individual Help and Caregiver Help personas.

## Live Demo

https://prompt-wars-cthxcneta9c6hyae.indiasouthcentral-01.azurewebsites.net/

<img width="1901" height="850" alt="image" src="https://github.com/user-attachments/assets/edede490-0f81-4042-91d8-e13a783b5f9b" />


## Core Features

1. Dual persona experience with separate pages
- Individual Help page with dedicated visual identity and emergency flow
- Caregiver Help page with its own dedicated flow and styling
- Persona toggle in the header to switch instantly between both modes
- Default mode on load is Individual Help

2. One-tap emergency activation flow
- Large emergency HELP trigger for immediate action
- Simulated call connection sequence with a 10 second countdown
- Connected state message after countdown completes
- Inline SOS confirmation popup shown after HELP is pressed

3. Emergency Action Branches (4-branch triage)
- Branch 1: Direct call action for National Helpline 112
- Branch 2: Spoken de-escalation script with one-click copy
- Branch 3: Physical intervention checklist for step-by-step execution
- Branch 4: One-tap SOS broadcast by SMS plus copy message option

4. Respiration Grounding Sync module
- Animated breathing pacer with inhale, hold, exhale phases
- Real-time phase transitions and second-level countdown
- Always available as a grounding aid in the safety tools section
- Also emphasized during active call-connection stage

5. Harm reduction micro-cards
- Persona-aware safety cards rendered from crisis data
- Category labels, actionable descriptions, and quick scanning layout
- Designed for low-friction decision support under stress

6. Gemini AI crisis synthesis with safe fallbacks
- Uses Gemini Flash Latest endpoint for structured emergency output
- Persona-specific system prompts for caregiver vs individual scenarios
- Enforced JSON schema for predictable rendering
- Graceful zero-crash fallback to high-fidelity mock data when:
	- API key is missing
	- API response parsing fails
	- API request fails due to network/quota/errors

7. Prompt transparency and telemetry inspector
- Prompt Inspector modal for hackathon judging and debugging
- Displays active system instruction and enforced JSON schema
- Shows safety setting configuration used for generation
- Includes last prompt sent, API latency, and raw API payload snapshot

8. API key management UX
- Secure key entry via settings modal
- Key state indicator in the header
- Save, clear, and status feedback in modal
- Key stored in browser local storage only

9. Responsive crisis-first UI
- Mobile and desktop responsive layout
- High-contrast visual hierarchy with large touch targets
- Modal-driven utilities for quick access under pressure

## Application Flow

1. User lands in Individual Help mode by default.
2. User can switch to Caregiver Help from the header toggle.
3. User taps HELP.
4. App immediately shows SOS sent popup and starts call connection countdown.
5. During countdown, breathing guidance and grounding context are shown.
6. After connection, app triggers Gemini crisis synthesis.
7. User continues with emergency branches, breathing support, and harm reduction actions.

## Tech Stack

- Angular 22 (standalone components + signals)
- RxJS for async request handling
- Tailwind CSS for UI styling
- Gemini Flash Latest API integration
- Node static server for production runtime

## Local Development

1. Install dependencies

npm install

2. Start Angular dev server

npm run start:dev

3. Open

http://localhost:4200

## Build and Run Production

1. Build production bundle

npm run build

2. Start production server

npm run start

Server runs on PORT environment variable when available, otherwise 8080.

## Scripts

- npm run start: starts Node production server
- npm run start:dev: starts Angular development server
- npm run build: creates production build
- npm run watch: development watch build
- npm run test: runs tests

## Safety and Reliability Notes

- The app is designed as support tooling and not a replacement for emergency professionals.
- Helpline call and SOS actions are surfaced as first-class, one-tap options.
- AI responses are structured and validated with fallback paths to avoid blank or broken UI.

## Hackathon Focus

This project emphasizes:
- Cognitive-zero interaction design
- Prompt and model transparency for judging
- Resilience under API failure conditions
- Real-time emergency usability over generic chatbot behavior
