import React from 'react';
import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';

interface VoiceMicButtonProps {
  isListening: boolean;
  isLoading: boolean;
  isSpeaking: boolean;
  onToggle: () => void;
  onStopAudio: () => void;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  isListening,
  isLoading,
  isSpeaking,
  onToggle,
  onStopAudio,
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div className="relative flex items-center justify-center">
        {/* Ripple rings when listening */}
        {isListening && (
          <>
            <div className="absolute w-36 h-36 rounded-full bg-rose-400/40 animate-ping" />
            <div className="absolute w-48 h-48 rounded-full bg-rose-300/30 animate-pulse" />
          </>
        )}

        {/* Ripple rings when speaking */}
        {isSpeaking && (
          <div className="absolute w-36 h-36 rounded-full bg-amber-400/30 animate-pulse" />
        )}

        {/* The Big Gentle Touch Button */}
        <button
          onClick={isSpeaking ? onStopAudio : onToggle}
          disabled={isLoading}
          type="button"
          aria-label={isListening ? 'பேசுவதை நிறுத்த' : 'பேசத் தொடங்க'}
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-95 cursor-pointer border-4 ${
            isListening
              ? 'bg-gradient-to-tr from-rose-600 to-red-500 border-white text-white shadow-rose-500/50 scale-105'
              : isSpeaking
              ? 'bg-gradient-to-tr from-amber-600 to-orange-500 border-amber-200 text-white shadow-amber-500/50'
              : isLoading
              ? 'bg-stone-300 border-stone-400 text-stone-600 cursor-wait'
              : 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-700 border-emerald-200 text-white hover:brightness-105 hover:scale-102 shadow-emerald-700/40'
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-10 h-10 animate-spin" />
          ) : isListening ? (
            <>
              <Mic className="w-10 h-10 animate-pulse text-white" />
              <span className="text-[11px] font-bold mt-1 tracking-wider uppercase">நிறுத்த</span>
            </>
          ) : isSpeaking ? (
            <>
              <Volume2 className="w-10 h-10 animate-bounce text-white" />
              <span className="text-[11px] font-bold mt-1 tracking-wider uppercase">நிறுத்த</span>
            </>
          ) : (
            <>
              <Mic className="w-11 h-11 text-white drop-shadow-md" />
              <span className="text-[12px] font-extrabold mt-1 tracking-wide">பேசுக</span>
            </>
          )}
        </button>
      </div>

      {/* Main Guidance Text underneath */}
      <div className="mt-4 text-center">
        {isListening ? (
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-base sm:text-lg font-bold text-rose-800 animate-pulse">
              🔴 அக்கா கேட்கிறேன்... உங்க சந்தேகத்தை பேசுங்கம்மா
            </span>
            {/* Visualizer bars */}
            <div className="flex items-center gap-1 h-5 mt-1">
              <span className="w-1 bg-rose-500 rounded-full h-2 animate-[pulse_0.4s_ease-in-out_infinite]" />
              <span className="w-1 bg-rose-600 rounded-full h-4 animate-[pulse_0.6s_ease-in-out_infinite]" />
              <span className="w-1 bg-rose-500 rounded-full h-5 animate-[pulse_0.3s_ease-in-out_infinite]" />
              <span className="w-1 bg-rose-600 rounded-full h-3 animate-[pulse_0.5s_ease-in-out_infinite]" />
              <span className="w-1 bg-rose-500 rounded-full h-2 animate-[pulse_0.4s_ease-in-out_infinite]" />
            </div>
          </div>
        ) : isSpeaking ? (
          <p className="text-base sm:text-lg font-bold text-amber-900">
            🔊 அக்கா பதில் சொல்கிறேன்... கேட்டுக்கொள்ளுங்கள் அம்மா
          </p>
        ) : isLoading ? (
          <p className="text-base sm:text-lg font-semibold text-stone-600">
            அக்கா யோசிக்கிறேன்... ஒரு நொடி பொறுங்கம்மா...
          </p>
        ) : (
          <div>
            <p className="text-base sm:text-lg font-bold text-stone-800">
              பச்சை நிற பட்டனை தொட்டு குரலில் பேசுங்கள் அம்மா
            </p>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              (எந்த தமிழ் வட்டார வழக்கிலும் அல்லது Tanglish-லும் பேசலாம்)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
