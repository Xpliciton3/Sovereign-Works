# UPDATE_00 — PROJECT IGNITION

## Project name: Sovereign Works
## Traditions: Imperium (INTJ/Garrin) + Tending (ESFJ/Holli)
## Repo: https://github.com/xpliciton3/Imperium (main branch)
## Hosting: GitHub Pages for prototype; Firebase + EAS for apps

## WHAT THIS BUILD PRODUCES
Two React Native (Expo) apps:
- apps/imperium — Garrin's INTJ app
- apps/tending  — Holli's ESFJ app

Shared package: packages/shared (types, hooks, data, Firebase)

## CRITICAL CONSTRAINTS
- Everything free. No paid services. No credit card required for any dependency.
- Groq API free tier (llama-3.3-70b-versatile) for AI features
- Firebase Realtime Database Spark plan (free tier)
- Expo EAS free tier for local APK builds
- Phone-only deployment (Android). iOS not in scope for Layers 1-4.

## CONTENT RULE
Cursor does not write doctrine, recipes, quotes, language vocabulary, ceremony text,
shadow work prompts, or any descriptive copy. All content comes from spec files.
When spec content is not locatable, Cursor writes: // TODO: content from [filename]
This rule is never suspended.

## LAYER ORDER
1. Prototype verification (sovereign_v9.jsx)
2. React Native Daily Hub (Home, Planner, Nourish)
3. Native Android alarm system
4. Firebase household sync
5+ Local AI, watch app, desktop app (future)
