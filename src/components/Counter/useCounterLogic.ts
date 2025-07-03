
import { useState, useCallback, useEffect } from 'react';

interface UseCounterLogicProps {
  initialValue: number;
  allowNegative: boolean;
  onCountChange?: (count: number) => void;
  speakText: (text: string, language?: string) => void;
  language?: string;
  currentLetter?: string;
}

export const useCounterLogic = ({ 
  initialValue, 
  allowNegative, 
  onCountChange, 
  speakText,
  language = 'es',
  currentLetter = ''
}: UseCounterLogicProps) => {
  const [count, setCount] = useState(initialValue);
  const [previousLetter, setPreviousLetter] = useState(currentLetter);

  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);

  // Announce letter change when it occurs
  useEffect(() => {
    if (currentLetter && currentLetter !== previousLetter && previousLetter !== '') {
      speakText(currentLetter, language);
    }
    setPreviousLetter(currentLetter);
  }, [currentLetter, previousLetter, speakText, language]);

  const increment = useCallback(() => {
    setCount(currentCount => {
      let newCount;
      if (allowNegative) {
        if (currentCount === 99) {
          newCount = -99;
        } else if (currentCount === -1) {
          newCount = 1;
        } else if (currentCount === -99) {
          newCount = -98;
        } else {
          newCount = currentCount + 1;
        }
      } else {
        newCount = currentCount === 99 ? 0 : currentCount + 1;
      }
      
      // Speak the new number
      speakText(newCount.toString(), language);
      return newCount;
    });
  }, [allowNegative, speakText, language]);

  const decrement = useCallback(() => {
    setCount(currentCount => {
      let newCount;
      if (allowNegative) {
        if (currentCount === -99) {
          newCount = 99;
        } else if (currentCount === 1) {
          newCount = -1;
        } else if (currentCount === 99) {
          newCount = 98;
        } else {
          newCount = currentCount - 1;
        }
      } else {
        newCount = currentCount === 0 ? 99 : currentCount - 1;
      }
      
      // Speak the new number
      speakText(newCount.toString(), language);
      return newCount;
    });
  }, [allowNegative, speakText, language]);

  return { count, increment, decrement };
};
