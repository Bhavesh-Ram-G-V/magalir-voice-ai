import React from 'react';
import { Mic, Volume2, MapPin, CheckCircle } from 'lucide-react';

export const RuralGuidanceSteps: React.FC = () => {
  return (
    <div className="w-full max-w-3xl mx-auto my-6 px-3">
      <div className="bg-amber-100/60 border border-amber-300/80 rounded-2xl p-4 sm:p-5">
        <h4 className="text-center font-bold text-amber-950 text-sm sm:text-base mb-3 font-sans">
          குரல் வழிகாட்டி பயன்படுத்த 3 எளிய வழிகள்:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-white/90 rounded-xl p-3 shadow-2xs border border-amber-200">
            <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-base mb-2">
              1
            </div>
            <h5 className="font-bold text-xs text-stone-900">மைக் பட்டனை தொடவும்</h5>
            <p className="text-[11px] text-stone-600 mt-1">
              மேலே உள்ள பச்சை பட்டனை ஒருமுறை லேசாக தட்டுங்கள்.
            </p>
          </div>

          <div className="bg-white/90 rounded-xl p-3 shadow-2xs border border-amber-200">
            <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-extrabold text-base mb-2">
              2
            </div>
            <h5 className="font-bold text-xs text-stone-900">இயல்பாக பேசுங்கள்</h5>
            <p className="text-[11px] text-stone-600 mt-1">
              "கர்ப்பமா இருக்கேன்", "ஆயிரம் ரூபா வருமா", எதுவானாலும் கேளுங்கள்.
            </p>
          </div>

          <div className="bg-white/90 rounded-xl p-3 shadow-2xs border border-amber-200">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-base mb-2">
              3
            </div>
            <h5 className="font-bold text-xs text-stone-900">பதிலை கேட்டு செல்லவும்</h5>
            <p className="text-[11px] text-stone-600 mt-1">
              அக்கா சொல்லும் அங்கன்வாடி அல்லது இ-சேவை மையத்திற்கு செல்லுங்கள்.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
