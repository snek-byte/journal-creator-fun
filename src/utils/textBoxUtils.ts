
import React from 'react';
import { TextStyle } from '@/utils/unicodeTextStyles';

// Get styled text component styles
export const getTextStyles = (
  font: string, 
  fontSize: string, 
  fontWeight: string, 
  fontColor: string, 
  gradient: string, 
  textStyle: string, 
  rotation: number
): React.CSSProperties => {
  const usingGradient = gradient && gradient !== '';
  
  const styles: React.CSSProperties = {
    fontFamily: font || 'sans-serif',
    fontSize: fontSize || '16px',
    fontWeight: fontWeight as any || 'normal',
    padding: '0.5rem',
    width: '100%',
    height: '100%',
    border: 'none',
    resize: 'none',
    backgroundColor: 'transparent',
    overflow: 'hidden',
    boxSizing: 'border-box',
    wordBreak: 'break-word',
  };
  
  // Handle text style
  if (textStyle) {
    if (textStyle.includes('italic')) {
      styles.fontStyle = 'italic';
    }
    
    if (textStyle.includes('underline')) {
      styles.textDecoration = 'underline';
    }
  }
  
  // Handle gradient or solid color
  if (usingGradient) {
    styles.background = gradient;
    styles.WebkitBackgroundClip = 'text';
    styles.WebkitTextFillColor = 'transparent';
    styles.backgroundClip = 'text';
    styles.color = 'transparent';
  } else {
    styles.color = fontColor || '#000000';
  }
  
  return styles;
};

// Get print styles for text boxes
export const getPrintStyles = () => `
  @media print {
    .text-box-controls { display: none !important; }
    .text-box-component { border: none !important; }
  }
`;
