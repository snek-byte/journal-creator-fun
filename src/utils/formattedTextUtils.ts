
import { unicodeMap } from '@/utils/unicodeTextStyles';

// Export the map with a consistent name
export const unicodeTextStyles = unicodeMap;

// Text styling utility functions
export const getTextStyle = (textStyle: string) => {
  if (unicodeTextStyles[textStyle]) {
    return {}; // Unicode styling is applied in renderUnicodeText
  }

  const styleMap: Record<string, React.CSSProperties> = {
    shadow: {
      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
    },
    outline: {
      WebkitTextStroke: '1px black',
      textShadow: 'none'
    },
    embossed: {
      textShadow: '2px 2px 2px rgba(0, 0, 0, 0.6), -1px -1px 1px rgba(255, 255, 255, 0.5)'
    },
    glow: {
      textShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 10px rgba(255, 255, 255, 0.5)'
    }
  };

  return styleMap[textStyle] || {};
};

export const renderUnicodeText = (textContent: string, textStyle: string) => {
  if (unicodeTextStyles[textStyle]) {
    return textContent
      .split('')
      .map(char => {
        const normalChar = char.normalize('NFKD')[0]; // Get base character
        const styleMap = unicodeTextStyles[textStyle];
        return styleMap[normalChar] || char;
      })
      .join('');
  }
  return textContent;
};

export const getGradientStyle = (gradient: string) => {
  return {
    backgroundImage: gradient,
  };
};
