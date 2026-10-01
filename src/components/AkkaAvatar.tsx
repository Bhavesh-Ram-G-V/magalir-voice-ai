import React from 'react';
import { Volume2, Mic, HeartHandshake } from 'lucide-react';

interface AkkaAvatarProps {
  isListening: boolean;
  isSpeaking: boolean;
  isLoading: boolean;
}

export const AkkaAvatar: React.FC<AkkaAvatarProps> = ({
  isListening,
  isSpeaking,
  isLoading,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Avatar Container */}
      <div className="relative">
        {/* Glow rings when speaking or listening */}
        {(isListening || isSpeaking) && (
          <div
            className={`absolute -inset-3 rounded-full blur-md opacity-75 animate-pulse ${
              isListening ? 'bg-rose-400' : 'bg-amber-400'
            }`}
          />
        )}

        <div
          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 shadow-xl transition-all duration-300 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-100 to-rose-200 ${
            isListening
              ? 'border-rose-500 ring-4 ring-rose-200 scale-105'
              : isSpeaking
              ? 'border-amber-500 ring-4 ring-amber-200 scale-105'
              : 'border-amber-600'
          }`}
        >
          {/* Akka Illustration SVG */}
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full object-cover"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background warmth */}
            <circle cx="60" cy="60" r="58" fill="#FDF2E9" />
            
            {/* Saree Pallu & Blouse (Green & Red traditional) */}
            <path d="M10 120 Q60 85 110 120 Z" fill="#2E7D32" />
            <path d="M25 120 Q60 90 95 120 Z" fill="#C62828" />
            <path d="M40 92 L60 115 L80 92 Z" fill="#D32F2F" />
            {/* Saree zari border */}
            <path d="M12 118 Q60 87 108 118" stroke="#FBC02D" strokeWidth="3" fill="none" />

            {/* Neck & Face */}
            <rect x="52" y="70" width="16" height="20" rx="4" fill="#D79E75" />
            <ellipse cx="60" cy="52" rx="26" ry="30" fill="#E6AF8A" />

            {/* Hair Bun with Jasmine Garland (Malli poo) */}
            <circle cx="36" cy="38" r="14" fill="#1C1917" />
            <circle cx="30" cy="32" r="4.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="1" />
            <circle cx="35" cy="27" r="4.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="1" />
            <circle cx="42" cy="25" r="4.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="1" />
            <circle cx="27" cy="39" r="4.5" fill="#FFFFFF" stroke="#FEF08A" strokeWidth="1" />

            {/* Hair front */}
            <path
              d="M34 45 C35 25, 85 25, 86 45 C86 36, 75 32, 60 32 C45 32, 34 36, 34 45 Z"
              fill="#1C1917"
            />

            {/* Traditional Round Red Pottu (Kumkum Bindi) */}
            <circle cx="60" cy="45" r="3.2" fill="#B91C1C" />

            {/* Eyes */}
            <ellipse cx="49" cy="52" rx="3.5" ry="2.2" fill="#1C1917" />
            <circle cx="50" cy="51.5" r="1" fill="#FFFFFF" />
            <ellipse cx="71" cy="52" rx="3.5" ry="2.2" fill="#1C1917" />
            <circle cx="72" cy="51.5" r="1" fill="#FFFFFF" />

            {/* Eyebrows */}
            <path d="M44 48 Q49 46 54 48" stroke="#1C1917" strokeWidth="1.5" fill="none" />
            <path d="M66 48 Q71 46 76 48" stroke="#1C1917" strokeWidth="1.5" fill="none" />

            {/* Nose Pin (Mookkuthi) */}
            <circle cx="64" cy="58" r="1.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.5" />

            {/* Kind, warm motherly smile */}
            {isSpeaking ? (
              <path
                d="M51 66 Q60 76 69 66 Z"
                fill="#991B1B"
                className="animate-pulse"
              />
            ) : (
              <path
                d="M52 66 Q60 73 68 66"
                stroke="#991B1B"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Earrings (Jimikki) */}
            <circle cx="34" cy="58" r="2.5" fill="#F59E0B" />
            <path d="M32 60 L36 60 L35 64 L33 64 Z" fill="#D97706" />
            <circle cx="86" cy="58" r="2.5" fill="#F59E0B" />
            <path d="M84 60 L88 60 L87 64 L85 64 Z" fill="#D97706" />
          </svg>
        </div>

        {/* Status indicator bubble */}
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border border-amber-200">
          {isListening ? (
            <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center animate-ping">
              <Mic className="w-3 h-3" />
            </div>
          ) : isSpeaking ? (
            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center animate-bounce">
              <Volume2 className="w-3 h-3" />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <HeartHandshake className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>

      {/* Akka Name and Speech state banner */}
      <div className="mt-3">
        <h2 className="text-lg font-bold text-amber-950 font-sans">
          அங்கன்வாடி அக்கா
        </h2>
        <div className="inline-flex items-center gap-1.5 mt-0.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-100 text-amber-900 border border-amber-200">
          {isListening ? (
            <span className="flex items-center text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping mr-1.5" />
              அம்மா, நான் கேட்கிறேன்... பேசுங்க!
            </span>
          ) : isSpeaking ? (
            <span className="flex items-center text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse mr-1.5" />
              அக்கா பேசுகிறேன்...
            </span>
          ) : isLoading ? (
            <span className="flex items-center text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce mr-1.5" />
              தகவலை தேடுகிறேன்...
            </span>
          ) : (
            <span className="text-emerald-800">
              வணக்கம் அம்மா! உதவிக்கு மைக் அமுக்கி பேசுங்க
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
