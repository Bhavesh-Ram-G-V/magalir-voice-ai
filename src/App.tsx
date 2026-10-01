import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { AkkaAvatar } from './components/AkkaAvatar';
import { VoiceMicButton } from './components/VoiceMicButton';
import { ResponseBanner } from './components/ResponseBanner';
import { SchemeCards } from './components/SchemeCards';
import { DialectTester } from './components/DialectTester';
import { TextInputFallback } from './components/TextInputFallback';
import { RuralGuidanceSteps } from './components/RuralGuidanceSteps';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import { AlertCircle, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function App() {
  const {
    isListening,
    isSpeaking,
    isLoading,
    userTranscript,
    akkaReply,
    activeScheme,
    lastResponseData,
    errorMessage,
    isSupported,
    toggleListening,
    startListening,
    processMessage,
    replayAudio,
    stopAudio,
    setActiveScheme,
  } = useVoiceAssistant();

  // Welcome announcement or greeting on initial load (optional or on first user click)
  useEffect(() => {
    // Keep clean
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/70 via-stone-50 to-orange-50/40 text-stone-800 font-sans selection:bg-amber-200">
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-8 flex flex-col items-center">
        {/* Browser Voice Support Alert */}
        {!isSupported && (
          <div className="w-full max-w-xl mb-4 p-3 bg-amber-100 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              உங்கள் உலாவியில் குரல் அங்கீகாரம் நேரடியாக ஆதரிக்கப்படவில்லை. கீழே உள்ள மாதிரி கேள்விகளைத் தொட்டு அல்லது எழுத்து பலகையை பயன்படுத்தி கேட்கலாம் அம்மா.
            </p>
          </div>
        )}

        {/* Dynamic Error Notification */}
        {errorMessage && (
          <div className="w-full max-w-xl mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-center justify-between gap-2.5 text-xs sm:text-sm text-rose-900 shadow-sm animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => toggleListening()}
              type="button"
              className="text-xs font-bold underline cursor-pointer hover:text-rose-950"
            >
              மறுபடியும் முயல
            </button>
          </div>
        )}

        {/* Central Persona Hero Section */}
        <div className="w-full max-w-2xl bg-white/90 border border-amber-200/90 rounded-3xl p-6 sm:p-8 shadow-sm text-center relative overflow-hidden backdrop-blur-xs">
          {/* Subtle floral/kolam background accent */}
          <div className="absolute top-2 right-2 text-amber-200/40 pointer-events-none text-6xl font-serif select-none">
            ✿
          </div>
          <div className="absolute bottom-2 left-2 text-amber-200/40 pointer-events-none text-6xl font-serif select-none">
            ✿
          </div>

          {/* Akka Interactive Visual Avatar */}
          <AkkaAvatar
            isListening={isListening}
            isSpeaking={isSpeaking}
            isLoading={isLoading}
          />

          {/* The Primary Mic Button */}
          <VoiceMicButton
            isListening={isListening}
            isLoading={isLoading}
            isSpeaking={isSpeaking}
            onToggle={toggleListening}
            onStopAudio={stopAudio}
          />

          {/* Fallback Text Input Toggle */}
          <TextInputFallback
            onSubmit={processMessage}
            isLoading={isLoading}
          />
        </div>

        {/* Response Banner with Akka's answer and physical action instructions */}
        <ResponseBanner
          userTranscript={userTranscript}
          akkaReply={akkaReply}
          lastResponseData={lastResponseData}
          isSpeaking={isSpeaking}
          onReplay={replayAudio}
          onStopAudio={stopAudio}
          onStartSpeakAgain={startListening}
        />

        {/* Quick Dialect & Tanglish Test Prompts */}
        <DialectTester
          onSelectQuery={processMessage}
          isLoading={isLoading}
        />

        {/* The 4 Core Government Schemes with Recommended Highlight */}
        <SchemeCards
          activeScheme={activeScheme}
          onSelectSampleQuery={processMessage}
          onExplainScheme={processMessage}
        />

        {/* 3-Step Simple Rural Woman Audio Usage Guide */}
        <RuralGuidanceSteps />
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 py-6 px-4 mt-auto border-t border-stone-800 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-rose-400" />
            <p className="text-stone-300 font-medium">
              அங்கன்வாடி அக்கா - தமிழ்நாடு மகளிர் மற்றும் குழந்தைகள் நலன்
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              அரசு விதிமுறைகளுக்கு உட்பட்டது
            </span>
            <span>•</span>
            <span>அங்கன்வாடி நேரம்: காலை 9:30 - மாலை 3:30</span>
            <span>•</span>
            <span>புதன்கிழமை: குழந்தைகள் தடுப்பூசி நாள்</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
