
export interface CounterProps {
  onCountChange?: (count: number) => void;
  size?: string;
  color?: string;
  language?: string;
  allowNegative?: boolean;
  initialValue?: number;
  currentLetter?: string;
}

export interface CounterRef {
  handleScreenClick: (event: React.MouseEvent) => void;
  handleScreenMouseUp: () => void;
  handleScreenMouseLeave: () => void;
}
