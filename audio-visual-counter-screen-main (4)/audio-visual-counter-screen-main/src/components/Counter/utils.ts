
export const getDisplayValue = (num: number) => {
  return Math.abs(num).toString().padStart(2, '0');
};

export const getColorClasses = (color: string) => {
  const colorMap: Record<string, string> = {
    'green-400': 'text-green-400',
    'blue-400': 'text-blue-400',
    'red-400': 'text-red-400',
    'yellow-400': 'text-yellow-400',
    'purple-400': 'text-purple-400',
    'pink-400': 'text-pink-400'
  };
  return colorMap[color] || colorMap['green-400'];
};
