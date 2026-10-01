# Anganwadi Akka (அங்கன்வாடி அக்கா) 🌾🔊

> A voice-first, zero-UI AI assistant bridging the rural digital divide by helping women navigate Tamil Nadu government welfare schemes using natural conversational Tamil.

---

## 💡 Problem Statement
Rural women and marginalized communities in Tamil Nadu often face literacy, language, and UI navigation barriers when attempting to access essential government welfare schemes (such as maternity aid, nutrition programs, and social security). **Anganwadi Akka** replaces complex forms and text-heavy portals with an accessible, audio-first conversational experience.

---

## ✨ Key Features
- **Voice-First Navigation:** Powered by browser-native Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) for seamless spoken Tamil (`ta-IN`) input and audio playback.
- **Context-Aware Welfare Guidance:** Leverages **Gemini 1.5 Flash** with custom system prompts to explain scheme eligibility, required documents, and application steps in simple, empathetic Tamil/Tanglish.
- **TTS Text Sanitation:** Built-in helper functions automatically strip markdown formatting (`**`, `*`, `#`, `-`) and emojis before processing audio to ensure smooth, natural speech synthesis without phonetic artifacts.
- **Secure Runtime Deployment:** Hosted via Google AI Studio with environment-based API key isolation.

---

## 🛠️ Tech Stack
- **AI Model:** Google Gemini 1.5 Flash (via `@google/genai` SDK)
- **Frontend Framework:** React + Vite
- **Speech Engine:** Web Speech API (`ta-IN` locale)
- **Deployment & Hosting:** Google AI Studio Publish Platform

---

## 🚀 Live Demo
Access the live published application here:  
🔗 **[https://anganwadi-akka.ai.studio](https://anganwadi-akka.ai.studio)**

---

