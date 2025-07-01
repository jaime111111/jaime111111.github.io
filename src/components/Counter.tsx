import React, { useState, useCallback, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

interface CounterProps {
  onCountChange?: (count: number) => void;
  size?: string;
  color?: string;
  language?: string;
  allowNegative?: boolean;
  initialValue?: number;
  currentLetter?: string;
}

interface CounterRef {
  handleScreenClick: (event: React.MouseEvent) => void;
  handleScreenMouseUp: () => void;
  handleScreenMouseLeave: () => void;
}

const LOCAL_STORAGE_COUNTER_KEY = "customDemoLastCounter";

const Counter = forwardRef<CounterRef, CounterProps>(({
  onCountChange, 
  size = '160px', 
  color = 'green-400',
  language = 'es',
  allowNegative = false,
  initialValue = 0,
  currentLetter = '',
  ...rest
}, ref) => {
  const [count, setCount] = useState(initialValue);
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speakNumber = useCallback((number: number) => {
    if ('speechSynthesis' in window) {
      // Cancel any existing speech
      window.speechSynthesis.cancel();
      
      // Clear any existing timeout
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      
      // Add a longer delay to ensure speech synthesis is ready and avoid errors
      speechTimeoutRef.current = setTimeout(() => {
        try {
          const numberString = Math.abs(number).toString(); // Remove zero padding for speech
          let utter: string;
          if (language === 'es') {
            utter = `atendiendo, al ${currentLetter} ${numberString}`;
          } else {
            utter = `atendiendo, al ${currentLetter} ${numberString}`;
          }
          
          console.log('Speaking:', utter);
          
          const utterance = new SpeechSynthesisUtterance(utter);
          utterance.rate = 0.6;
          utterance.pitch = 1.0;
          utterance.volume = 1.0;
          utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
          
          utterance.onstart = () => console.log('Speech started');
          utterance.onend = () => console.log('Speech ended');
          utterance.onerror = (event) => {
            console.error('Speech error:', event);
            // Try again with a simpler approach
            setTimeout(() => {
              const simpleUtterance = new SpeechSynthesisUtterance(`atendiendo, al ${currentLetter} ${numberString}`);
              simpleUtterance.lang = 'es-ES';
              window.speechSynthesis.speak(simpleUtterance);
            }, 500);
          };
          
          // Ensure voices are loaded before speaking
          if (window.speechSynthesis.getVoices().length === 0) {
            window.speechSynthesis.addEventListener('voiceschanged', () => {
              window.speechSynthesis.speak(utterance);
            }, { once: true });
          } else {
            window.speechSynthesis.speak(utterance);
          }
        } catch (error) {
          console.error('Speech synthesis error:', error);
        }
      }, 300);
    }
  }, [language, currentLetter]);

  useEffect(() => {
    onCountChange?.(count);
  }, [count, onCountChange]);

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
      speakNumber(newCount);
      return newCount;
    });
  }, [allowNegative, speakNumber]);

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
      speakNumber(newCount);
      return newCount;
    });
  }, [allowNegative, speakNumber]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleScreenClick: (event: React.MouseEvent) => {
      event.preventDefault();
      
      // Simple click: increment or decrement immediately
      if (event.button === 0) { // Left click
        increment();
      } else if (event.button === 2) { // Right click
        decrement();
      }
    },
    handleScreenMouseUp: () => {
      // No action needed - everything happens on click
    },
    handleScreenMouseLeave: () => {
      // No action needed - everything happens on click
    }
  }), [increment, decrement]);

  const colorMap: Record<string, string> = {
    'green-400': 'text-green-400',
    'blue-400': 'text-blue-400',
    'red-400': 'text-red-400',
    'yellow-400': 'text-yellow-400',
    'purple-400': 'text-purple-400',
    'pink-400': 'text-pink-400'
  };
  const colorClasses = colorMap[color] || colorMap['green-400'];

  const getDisplayValue = (num: number) => {
    return Math.abs(num).toString().padStart(2, '0');
  };

  console.log('[Counter render] count:', count, 'colorClasses:', colorClasses, 'size:', size);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div
          className={`font-mono font-bold px-4 py-2 text-white select-none ${colorClasses}`}
          style={{
            fontSize: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem'
          }}
        >
          <span>{currentLetter}</span>
          <span>{getDisplayValue(count)}</span>
        </div>
      </div>
    </div>
  );
});

Counter.displayName = 'Counter';

export default Counter;
