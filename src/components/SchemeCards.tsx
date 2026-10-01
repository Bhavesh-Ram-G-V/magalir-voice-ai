import React from 'react';
import { Baby, Coins, Scissors, Syringe, CheckCircle2, MapPin, FileCheck, Volume2 } from 'lucide-react';
import { SCHEMES_DATA } from '../data/schemes';
import { SchemeId } from '../types';

interface SchemeCardsProps {
  activeScheme: SchemeId | null;
  onSelectSampleQuery: (query: string) => void;
  onExplainScheme: (text: string) => void;
}

export const SchemeCards: React.FC<SchemeCardsProps> = ({
  activeScheme,
  onSelectSampleQuery,
  onExplainScheme,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby':
        return <Baby className="w-6 h-6 text-rose-600" />;
      case 'Coins':
        return <Coins className="w-6 h-6 text-amber-600" />;
      case 'Scissors':
        return <Scissors className="w-6 h-6 text-emerald-600" />;
      case 'Syringe':
        return <Syringe className="w-6 h-6 text-sky-600" />;
      default:
        return <Baby className="w-6 h-6" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-2">
      <div className="text-center mb-5">
        <h3 className="text-lg sm:text-xl font-black text-amber-950 font-sans">
          தமிழ்நாடு பெண்களுக்கான 4 முக்கிய நலத்திட்டங்கள்
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          நீங்கள் கேட்கும் கேள்வியின்படி தகுதியான திட்டம் கீழே தானாக தேர்ந்தெடுக்கப்படும்
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SCHEMES_DATA.map((scheme) => {
          const isSelected = activeScheme === scheme.id;

          return (
            <div
              key={scheme.id}
              className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 relative border-2 ${
                isSelected
                  ? `ring-4 ring-amber-300 shadow-xl scale-[1.02] ${scheme.borderColor} bg-white`
                  : 'bg-white/80 border-stone-200 hover:border-amber-300 shadow-sm'
              }`}
            >
              {/* Highlight Badge */}
              {isSelected && (
                <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[11px] font-extrabold px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>பரிந்துரைக்கப்பட்ட திட்டம்</span>
                </div>
              )}

              {/* Title & Icon Header */}
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl ${scheme.accentBg} shrink-0 border border-stone-200/60`}>
                  {getIcon(scheme.icon)}
                </div>
                <div className="flex-1">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${scheme.badgeColor}`}>
                    {scheme.benefitAmountTa}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-stone-900 mt-1 leading-snug">
                    {scheme.titleTa}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {scheme.subtitleTa}
                  </p>
                </div>
              </div>

              {/* Physical Location */}
              <div className="mt-3.5 pt-3 border-t border-stone-100 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-stone-800 block">
                    எங்கு செல்ல வேண்டும்:
                  </span>
                  <p className="text-xs text-stone-700 font-medium">
                    {scheme.targetLocationTa}
                  </p>
                </div>
              </div>

              {/* Required Documents */}
              <div className="mt-2.5 flex items-start gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-stone-800 block">
                    தேவையான ஆவணங்கள்:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scheme.requiredDocsTa.map((doc, idx) => (
                      <span
                        key={idx}
                        className="bg-stone-100 border border-stone-200 text-stone-700 text-[11px] px-2 py-0.5 rounded"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick sample question triggers */}
              <div className="mt-3 pt-2.5 border-t border-dashed border-stone-200 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onExplainScheme(scheme.exampleQueriesTa[0])}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                >
                  <Volume2 className="w-3 h-3 text-amber-600" />
                  <span>அக்காவிடம் இதைப் பற்றி கேட்க</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectSampleQuery(scheme.exampleQueriesTa[0])}
                  className="text-[11px] text-stone-500 hover:text-stone-800 underline decoration-dotted cursor-pointer"
                >
                  கேள்வி மாதிரி
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
