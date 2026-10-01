import { describe, it, expect } from 'vitest';

// Utility function test for TTS text sanitation
function cleanTextForTTS(input: string): string {
  return input
    .replace(/[*#_`-]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
    .trim();
}

describe('cleanTextForTTS Sanitation Unit Tests', () => {
  it('should remove markdown symbols from text', () => {
    const raw = '**வணக்கம்** #1';
    expect(cleanTextForTTS(raw)).toBe('வணக்கம் 1');
  });

  it('should handle plain Tamil text without modification', () => {
    const plain = 'அங்கன்வாடி திட்டம்';
    expect(cleanTextForTTS(plain)).toBe('அங்கன்வாடி திட்டம்');
  });
});
