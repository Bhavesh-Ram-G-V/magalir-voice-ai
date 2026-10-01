import React, { useState } from 'react';
import { Send, Keyboard, HelpCircle } from 'lucide-react';

interface TextInputFallbackProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export const TextInputFallback: React.FC<TextInputFallbackProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSubmit(inputText.trim());
    setInputText('');
  };

  return (
    <div className="w-full max-w-xl mx-auto my-3 px-3">
      <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 font-medium hover:text-amber-800 transition-colors cursor-pointer"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>{isOpen ? 'எழுத்து பலகையை மறை' : 'மைக் வேலை செய்யவில்லையா? தட்டச்சு செய்து கேட்க'}</span>
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="உதாரணம்: கர்ப்பிணி உதவித்தொகை பெற என்ன செய்ய வேண்டும்?"
            disabled={isLoading}
            className="flex-1 bg-white border-2 border-amber-300 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-stone-900 outline-hidden shadow-inner font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <span>கேட்க</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
};
