import React from 'react';
import { Sparkles, PhoneCall } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-amber-800 via-orange-800 to-rose-900 text-white shadow-md border-b-4 border-amber-500">
      <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-amber-200">
            அ
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-100 font-sans">
                அங்கன்வாடி அக்கா
              </h1>
              <span className="bg-amber-400/20 text-amber-200 text-xs px-2 py-0.5 rounded-full border border-amber-300/30 font-medium">
                தமிழ்நாடு
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
              கிராம பெண்களுக்கான குரல் வழி அரசு நலத்திட்ட வழிகாட்டி
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-amber-950/40 px-3 py-1.5 rounded-xl border border-amber-400/30 text-xs text-amber-100">
          <PhoneCall className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>அவசர உதவி: 181 (பெண்கள் உதவி எண்) | 104 (சுகாதாரம்)</span>
        </div>
      </div>
    </header>
  );
};
