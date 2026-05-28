# LAYER 5 PRIME PROMPT — SOVEREIGN WORKS
# Local AI + Vocal Coach + Language Practice + The Book
# Do not begin until all L4.01–L4.21 checkboxes are confirmed.

## WHAT LAYER 5 BUILDS

Local AI model integration and the doctrine content screens.

Layer 5 scope:
- Whisper Tiny (~75MB) — offline speech-to-text for voice input
- TFLite phoneme classifier (~50MB) — vocal coach for constructed languages
- DSP acoustic analysis (pure JS) — pitch, rate, volume, vowel formants
- Vel'nar vocal coach — IPA-driven TTS as canonical pronunciation (Imperium)
- Nen'thara register coach — tone and relational register (Tending)
- More tab: Warrior's Practice / Keeper's Practice screens (full content)
- More tab: Language guide screens (Vel'nar for Imperium)
- The Book screen — The Eight Who Carry the Fire (holy book, full text)
- Groq nuanced mood translation (replaces bracket system for online users)
- Daily planner widget for phone home screen

Layer 5 does NOT include:
- Calendar/schedule sub-tabs — Layer 6
- Charts — Layer 7
- Desktop app — Layer 8
- Watch app — Layer 9

## READ ORDER

1. `VELNAR_LANGUAGE_GUIDE.md` — Vel'nar phonology, morphology, vocabulary
2. `WARRIORS_PRACTICE.md` — full practice for Imperium screens
3. `TENDING_PRACTICE.md` — full practice for Tending screens
4. `HOLY_BOOK.md` — The Eight Who Carry the Fire (complete holy book, all 8 movements, verbatim)
5. `CEREMONIES_AND_OBSERVANCES.md` — Partnership Rite, Remembrance Rite, Naming Rite, 16 vows, Birthday Observance, milestone marking
6. `MASTER_IMPERIUM.md` — Imperium doctrine, shadow chapters, glossary
7. `MASTER_TENDING.md` — Tending doctrine and ceremony
8. `sovereign_v9.jsx` — vocal coach modal, language tab UI

## CONTENT RULE — UNCHANGED

Cursor does not write language vocabulary, IPA transcriptions, doctrine text,
practice instructions, holy book text, ceremony text, or vow language.
All content imported from spec files verbatim.
Holy book: import from HOLY_BOOK.md verbatim — do not summarize, paraphrase, or approximate.
Ceremonies: import from CEREMONIES_AND_OBSERVANCES.md verbatim.

## LOCAL MODELS

```
packages/shared/ai/
├── whisper/            ← Whisper Tiny GGML model file (~75MB)
│   ├── whisper.ggml.tiny.bin
│   └── README.md
└── phoneme/            ← TFLite phoneme classifier
    ├── phoneme_classifier.tflite (~50MB)
    └── README.md
```

Model sources:
- Whisper Tiny: https://huggingface.co/ggerganov/whisper.cpp
- TFLite phoneme: standard CMU pronunciation dictionary + TFLite export
- Integration: react-native-whisper or llama.rn (evaluate compatibility first)

## VOCAL COACH BEHAVIOR

IPA-driven TTS IS the canonical pronunciation. No pre-recorded audio exists.
When user taps a Vel'nar word:
1. IPA string retrieved from VELNAR_LANGUAGE_GUIDE.md vocabulary
2. Web Speech API or expo-speech generates TTS output from IPA
3. TFLite classifier analyzes user's microphone recording
4. DSP analysis: pitch contour, vowel formants, consonant closures
5. Feedback rendered as: match percentage + specific correction (not "try again")

Live conversation mode: Groq generates responses in Vel'nar/doctrine register.
Cursor does not write the conversation prompts. Import from VELNAR_LANGUAGE_GUIDE.md.

## DAILY PLANNER WIDGET

Android home screen widget (react-native-widget-extension or equivalent).
Shows: today's checklist items, checked count, one-line quote.
Updates when app is foregrounded.
Tapping opens app to Planner tab.
Data source: usePlanner hook via SQLite.

## BUILD SEQUENCE L5

```
L5.01  Install Whisper Tiny model — download and bundle
L5.02  Install TFLite phoneme classifier
L5.03  Whisper speech-to-text integration — voice input for planner items
L5.04  Vocal coach screen — Vel'nar (Imperium)
L5.05  IPA→TTS pipeline for canonical pronunciation
L5.06  TFLite phoneme feedback — match % and correction
L5.07  DSP acoustic analysis — pitch, formants, rate
L5.08  Live Vel'nar conversation mode (Groq)
L5.09  Nen'thara register coach (Tending) — tone analysis, no TFLite needed
L5.10  Warrior's Practice screen — full content from WARRIORS_PRACTICE.md
L5.11  Keeper's Practice screen — full content from TENDING_PRACTICE.md
L5.12  Language guide screen — Vel'nar vocabulary + phonology
L5.13  The Book screen — holy book text (import from MASTER docs)
L5.14  Groq nuanced mood translation — replaces bracket system when online
L5.15  Daily planner home screen widget
L5.16  Verify: vocal coach fires IPA TTS on word tap
L5.17  Verify: phoneme feedback is specific, not generic
L5.18  Verify: practice screens render all content from spec files
L5.19  Verify: The Book is readable with chapter navigation
L5.20  Mark all L5 checkboxes in 21_BUILD_SEQUENCE.md as [x]
```
