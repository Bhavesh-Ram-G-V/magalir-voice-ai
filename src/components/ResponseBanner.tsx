import React from 'react';
import { Volume2, VolumeX, RotateCcw, MapPin, FileText, Gift, ArrowRight } from 'lucide-react';
import { ChatResponse } from '../types';

interface ResponseBannerProps {
  userTranscript: string;
  akkaReply: string;
  lastResponseData: ChatResponse | null;
  isSpeaking: boolean;
  onReplay: () => void;
  onStopAudio: () => void;
  onStartSpeakAgain: () => void;
}

export const ResponseBanner: React.FC<ResponseBannerProps> = ({
  userTranscript,
  akkaReply,
  lastResponseData,
  isSpeaking,
  onReplay,
  onStopAudio,
  onStartSpeakAgain,
}) => {
  if (!akkaReply && !userTranscript) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-4 space-y-3">
      {/* User Voice Bubble */}
      {userTranscript && (
        <div className="flex items-start justify-end gap-2 text-right">
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] shadow-sm">
            <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider mb-0.5">
              நீங்கள் பேசியது
            </span>
            <p className="text-base font-medium leading-relaxed font-sans">
              "{userTranscript}"
            </p>
          </div>
        </div>
      )}

      {/* Akka Spoken Response Bubble */}
      {akkaReply && (
        <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          {/* Subtle warm decorative background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/50 rounded-bl-full pointer-events-none" />

          <div className="flex items-center justify-between pb-2 mb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
              <h3 className="font-bold text-amber-900 text-sm tracking-wide font-sans">
                அங்கன்வாடி அக்கா சொன்ன பதில்:
              </h3>
            </div>
            
            {/* Audio action controls */}
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <button
                  onClick={onStopAudio}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                  <span>நிறுத்து</span>
                </button>
              ) : (
                <button
                  onClick={onReplay}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>மீண்டும் கேட்க</span>
                </button>
              )}
            </div>
          </div>

          {/* Primary Speech Text (1-2 sentences, everyday Tamil) */}
          <p className="text-lg sm:text-xl font-medium text-stone-900 leading-relaxed font-sans mb-4">
            {akkaReply}
          </p>

          {/* Action-Oriented Details Card if scheme detected */}
          {lastResponseData && lastResponseData.detectedScheme !== 'unclear' && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs sm:text-sm space-y-2.5 mt-2">
              <div className="flex items-center justify-between text-amber-950 font-bold text-sm">
                <span className="flex items-center gap-1.5 text-amber-800">
                  <Gift className="w-4 h-4 text-amber-600" />
                  {lastResponseData.schemeTitleTa}
                </span>
                <span className="bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {lastResponseData.benefitSummaryTa}
                </span>
              </div>

              {/* Physical Location to go */}
              <div className="flex items-start gap-2 pt-1 border-t border-amber-200/60">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900 block text-xs">
                    செல்ல வேண்டிய இடம்:
                  </span>
                  <span className="text-stone-700 font-medium">
                    {lastResponseData.targetLocationTa}
                  </span>
                </div>
              </div>

              {/* Required Documents */}
              {lastResponseData.requiredDocsTa && lastResponseData.requiredDocsTa.length > 0 && (
                <div className="flex items-start gap-2 pt-1">
                  <FileText className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 block text-xs">
                      எடுத்துச் செல்ல வேண்டியவை (ஆவணங்கள்):
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {lastResponseData.requiredDocsTa.map((doc, idx) => (
                        <span
                          key={idx}
                          className="bg-white border border-amber-300 text-stone-800 px-2 py-0.5 rounded-md font-medium text-xs shadow-2xs"
                        >
                          ✓ {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Prompt to speak next question */}
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              வேறேதும் சந்தேகம் உள்ளதா அம்மா?
            </span>
            <button
              onClick={onStartSpeakAgain}
              type="button"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
            >
              <span>மறுபடியும் பேச</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
