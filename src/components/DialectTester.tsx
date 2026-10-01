import React from 'react';
import { Sparkles, MessageSquareQuote } from 'lucide-react';

interface DialectTesterProps {
  onSelectQuery: (query: string) => void;
  isLoading: boolean;
}

export const DialectTester: React.FC<DialectTesterProps> = ({
  onSelectQuery,
  isLoading,
}) => {
  const sampleDialects = [
    {
      dialect: 'கொங்கு / கிராமத்து வழக்கு (Kongu / Rural Tamil)',
      query: 'கர்ப்பமா இருக்கேனுங்க.. அரசாங்கத்துல இருந்து ஏதாச்சும் காசு தருவாங்களா?',
      badge: 'Kongu Tamil',
      badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    },
    {
      dialect: 'தங்கிலீஷ் பேச்சு வழக்கு (Tanglish Mix)',
      query: 'pregnancy kaaga govt la edhavadhu help iruka akka?',
      badge: 'Tanglish',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    {
      dialect: 'வழக்கமான கிராமத்து பேச்சு (Colloquial Tamil)',
      query: 'மாதம் ஆயிரம் ரூபாய் பணம் பெற என்ன செய்ய வேண்டும்?',
      badge: 'Magalir Urimai',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      dialect: 'தொழில் பயிற்சி கேள்வி (Skill Training)',
      query: 'நான் வீட்டில் இருந்து தையல் பயிற்சி இலவசமாக படிக்கலாமா?',
      badge: 'Skill / Tailoring',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      dialect: 'குழந்தை தடுப்பூசி கேள்வி (Child Immunization)',
      query: 'குழந்தைக்கு தடுப்பூசி போட எங்கு செல்ல வேண்டும்?',
      badge: 'Vaccine / PHC',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-4 h-4 text-amber-700" />
        <h4 className="text-sm sm:text-base font-bold text-amber-950 font-sans">
          வட்டார வழக்கு / தங்கிலீஷ் சோதனை கேள்விகள் (Click to Test)
        </h4>
      </div>
      <p className="text-xs text-stone-600 mb-3">
        கிராமத்து பேச்சு, கொங்கு தமிழ் அல்லது ஆங்கிலம் கலந்த பேச்சு (Tanglish) என எதையும் அங்கன்வாடி அக்கா எளிதாக புரிந்து கொள்வார். கீழே உள்ள ஏதேனும் ஒரு வரியை அழுத்தி சோதிக்கலாம்:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {sampleDialects.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectQuery(item.query)}
            className="flex items-start text-left gap-2.5 p-3 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-100/40 transition-all shadow-2xs group cursor-pointer disabled:opacity-50"
          >
            <MessageSquareQuote className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-semibold text-stone-500 truncate">
                  {item.dialect}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-stone-900 group-hover:text-amber-950 line-clamp-2">
                "{item.query}"
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
