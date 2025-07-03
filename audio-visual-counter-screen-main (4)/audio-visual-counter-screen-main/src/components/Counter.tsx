
import React, { forwardRef, useImperativeHandle } from 'react';
import { CounterProps, CounterRef } from './Counter/types';
import { useCounterAudio } from './Counter/useCounterAudio';
import { useCounterLogic } from './Counter/useCounterLogic';
import { getDisplayValue, getColorClasses } from './Counter/utils';

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
  const { speakText } = useCounterAudio();
  const { count, increment, decrement } = useCounterLogic({
    initialValue,
    allowNegative,
    onCountChange,
    speakText,
    language,
    currentLetter
  });

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

  const colorClasses = getColorClasses(color);

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
