import { describe, it, expect } from 'vitest';

function cleanTextForTTS(text: string): string {
  return text.replace(/[*#_`-]/g, '').trim();
}

describe('Anganwadi Akka Core Utility Tests', () => {
  it('should clean markdown characters before speech playback', () => {
    const rawText = '**வணக்கம்** #1';
    const cleaned = cleanTextForTTS(rawText);
    expect(cleaned).toBe('வணக்கம் 1');
  });

  it('should preserve Tamil unicode text integrity', () => {
    const tamilText = 'அங்கன்வாடி திட்டம்';
    expect(cleanTextForTTS(tamilText)).toBe('அங்கன்வாடி திட்டம்');
  });
});
