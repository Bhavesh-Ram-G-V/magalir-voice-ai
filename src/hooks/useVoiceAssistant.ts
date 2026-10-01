import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatResponse, SchemeId } from '../types';

// Declare types for Web Speech API
interface SpeechRecognitionEventLike {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

// Helper to clean text for Text-to-Speech playback
export function cleanTextForTTS(text: string): string {
  if (!text) return '';
  return text
    // Strip markdown formatting (**, *, #, -, _, ~, `, >, brackets, parentheses)
    .replace(/[*#_~`>[\]()]/g, ' ')
    .replace(/^[\s-–—*•]+/gm, ' ')
    // Strip emojis & unicode pictographs
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE0F}\u{1F1E6}-\u{1F1FF}]/gu, '')
    // Strip special technical symbols
    .replace(/[@$%^&+=\\|<>{}]/g, ' ')
    // Normalize consecutive whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

export function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [akkaReply, setAkkaReply] = useState('');
  const [activeScheme, setActiveScheme] = useState<SchemeId | null>(null);
  const [lastResponseData, setLastResponseData] = useState<ChatResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastTranscriptRef = useRef('');

  // 1. RELIABLE TAMIL VOICE SELECTION: Listen for speechSynthesis.onvoiceschanged
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsSupported(false);
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        const loaded = window.speechSynthesis.getVoices();
        if (loaded && loaded.length > 0) {
          setVoices(loaded);
        }
      };

      // Load initially
      updateVoices();

      // Listen for onvoiceschanged event
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  // Helper to find a reliable Tamil voice
  const findTamilVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const available = window.speechSynthesis.getVoices();
    const candidateList = available && available.length > 0 ? available : voices;

    if (!candidateList || candidateList.length === 0) return null;

    // Filter voice where voice.lang.toLowerCase().includes('ta') or voice.name.toLowerCase().includes('tamil')
    const tamilVoice = candidateList.find((voice) => {
      const lang = (voice.lang || '').toLowerCase();
      const name = (voice.name || '').toLowerCase();
      return (
        lang.includes('ta') ||
        name.includes('tamil') ||
        name.includes('தமிழ்')
      );
    });

    return tamilVoice || null;
  }, [voices]);

  // Stop current audio playback
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Speak pure Tamil text using Web Speech Synthesis API
  const speakText = useCallback((text: string, onFinish?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onFinish?.();
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // 1. CLEAN TEXT FOR TTS: Strips out markdown, emojis, and special symbols
    const cleanedText = cleanTextForTTS(text);
    if (!cleanedText) {
      onFinish?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // 2. RELIABLE TAMIL VOICE SELECTION: Find voice and explicitly assign utterance.voice = tamilVoice
    const tamilVoice = findTamilVoice();
    if (tamilVoice) {
      utterance.voice = tamilVoice;
    }

    // 3. VOICE PARAMETERS: Set utterance.lang = 'ta-IN', utterance.rate = 0.85, and utterance.pitch = 1.0
    utterance.lang = 'ta-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onFinish?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      onFinish?.();
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [findTamilVoice]);

  // Send message to Gemini backend
  const processMessage = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsLoading(true);
      setErrorMessage(null);
      stopAudio();

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });

        if (!res.ok) {
          throw new Error('Failed to get answer from server');
        }

        const data: ChatResponse = await res.json();
        setAkkaReply(data.speechText);
        setLastResponseData(data);
        if (data.detectedScheme && data.detectedScheme !== 'unclear') {
          setActiveScheme(data.detectedScheme);
        }

        // Automatic playback of response
        speakText(data.speechText);
      } catch (err: unknown) {
        console.error('Error processing query:', err);
        const fallbackText = 'அம்மா, எனக்கு இணைய இணைப்பு கிடைக்கல. தயவுசெய்து மறுபடியும் பேசுங்கம்மா.';
        setAkkaReply(fallbackText);
        setErrorMessage('இணைப்பு பிழை ஏற்பட்டது');
        speakText(fallbackText);
      } finally {
        setIsLoading(false);
      }
    },
    [speakText, stopAudio]
  );

  // Initialize Speech Recognition
  const startListening = useCallback(() => {
    stopAudio();
    setErrorMessage(null);

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setErrorMessage('உங்கள் உலாவியில் குரல் வசதி இல்லை. கீழே உள்ள பட்டன்களை பயன்படுத்தவும்.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRec();
      recognition.lang = 'ta-IN'; // Tamil (India)
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        lastTranscriptRef.current = '';
        setUserTranscript('');
      };

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserTranscript(transcript);
        lastTranscriptRef.current = transcript;
      };

      recognition.onerror = (event: { error: string }) => {
        console.warn('SpeechRecognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('மைக்ரோஃபோன் அனுமதி தேவை அம்மா. உலாவியில் அனுமதிக்கவும்.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('குரல் கேட்கவில்லை அம்மா. மறுபடியும் மைக் அமுக்கி பேசுங்க.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const finalRecorded = lastTranscriptRef.current.trim();
        if (finalRecorded) {
          processMessage(finalRecorded);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
      setErrorMessage('மைக்ரோஃபோன் தொடங்குவதில் சிக்கல். மீண்டும் அழுத்தவும்.');
    }
  }, [processMessage, stopAudio]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const replayAudio = useCallback(() => {
    if (akkaReply) {
      speakText(akkaReply);
    }
  }, [akkaReply, speakText]);

  return {
    isListening,
    isSpeaking,
    isLoading,
    userTranscript,
    akkaReply,
    activeScheme,
    lastResponseData,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
    processMessage,
    replayAudio,
    stopAudio,
    setActiveScheme,
  };
}
