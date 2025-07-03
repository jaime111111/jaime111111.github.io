
import { useRef, useEffect, useCallback } from 'react';

export const useCounterAudio = () => {
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    
    // Cleanup
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakText = useCallback((text: string, language: string = 'es') => {
    if (synthRef.current) {
      try {
        // Cancel any ongoing speech
        synthRef.current.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
        utterance.rate = 0.8;
        utterance.volume = 0.7;
        
        synthRef.current.speak(utterance);
      } catch (error) {
        console.error('Error with speech synthesis:', error);
      }
    }
  }, []);

  return { speakText };
};
