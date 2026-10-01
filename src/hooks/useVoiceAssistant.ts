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

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastTranscriptRef = useRef('');

  // Helper to ensure voices are asynchronously loaded via getVoices() and onvoiceschanged
  const getLoadedVoices = useCallback((): Promise<SpeechSynthesisVoice[]> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve([]);
        return;
      }
      const existing = window.speechSynthesis.getVoices();
      if (existing && existing.length > 0) {
        resolve(existing);
        return;
      }

      // 1. ASYNC VOICE LOADING: Use speechSynthesis.onvoiceschanged to ensure voices are fully loaded
      const handleVoicesChanged = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
          resolve(voices);
        }
      };

      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

      // Timeout fallback in case voices are already available or system doesn't emit voiceschanged
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        resolve(window.speechSynthesis.getVoices() || []);
      }, 700);
    });
  }, []);

  // 2. NATIVE TAMIL VOICE SELECTION: Filter getVoices() specifically looking for native voices
  // like 'Google தமிழ்', 'Microsoft Valluvar', 'Microsoft Heera', or 'ta-IN'
  const selectTamilVoice = useCallback((voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null;

    // A. Priority to known native Tamil voices:
    const nativeSpecific = voices.find((v) => {
      const name = v.name || '';
      return (
        name.includes('Google தமிழ்') ||
        name.includes('Microsoft Valluvar') ||
        name.includes('Microsoft Heera') ||
        name.includes('Valluvar') ||
        name.includes('Heera')
      );
    });
    if (nativeSpecific) return nativeSpecific;

    // B. Match exact 'ta-IN' language:
    const taInVoice = voices.find((v) => {
      const lang = (v.lang || '').replace('_', '-').toLowerCase();
      return lang === 'ta-in';
    });
    if (taInVoice) return taInVoice;

    // C. Match any voice with 'ta' in lang or 'tamil' in name:
    const generalTamil = voices.find((v) => {
      const lang = (v.lang || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      return (
        lang.includes('ta') ||
        lang.startsWith('ta-') ||
        name.includes('tamil') ||
        name.includes('தமிழ்')
      );
    });
    return generalTamil || null;
  }, []);

  // Check speech synthesis & recognition support on mount
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setIsSupported(false);
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Trigger voice pre-loading
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Stop current audio playback
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Speak pure Tamil text using Web Speech Synthesis API
  const speakText = useCallback(async (text: string, onFinish?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onFinish?.();
      return;
    }

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    // Clean text: pure spoken Tamil, no asterisks, no bullets
    const cleanText = text.replace(/[*#_~`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!cleanText) {
      onFinish?.();
      return;
    }

    // 1. ASYNC VOICE LOADING: Ensure voices are fully loaded before speaking
    const availableVoices = await getLoadedVoices();

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // 2. NATIVE TAMIL VOICE SELECTION: Filter to find a voice where voice.lang includes 'ta' or 'ta-IN'
    // Specifically look for 'Google தமிழ்', 'Microsoft Valluvar', 'Microsoft Heera', or 'ta-IN'
    const tamilVoice = selectTamilVoice(availableVoices);

    // 3. ASSIGN VOICE: Explicitly set utterance.voice = tamilVoice when a Tamil voice is found.
    // If no Tamil voice is installed on the system, fall back cleanly to utterance.lang = 'ta-IN'.
    if (tamilVoice) {
      utterance.voice = tamilVoice;
    }

    // 4. NATURAL PACE: Set utterance.rate = 0.85 and utterance.pitch = 1.0 so it speaks clearly and naturally
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
  }, [getLoadedVoices, selectTamilVoice]);

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
