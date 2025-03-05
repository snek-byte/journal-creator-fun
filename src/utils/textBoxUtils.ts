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

// Helper to set element transform with smooth transition
export const setTransform = (element: HTMLElement, x: number, y: number, rotation: number = 0) => {
  // Add a slight transition for smoother movements
  element.style.transition = 'transform 0.05s ease';
  
  const transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
  element.style.transform = transform;
  
  // Store position as data attributes
  element.setAttribute('data-x', x.toString());
  element.setAttribute('data-y', y.toString());
  element.setAttribute('data-rotation', rotation.toString());
  
  // Remove transition after movement to prevent lag on next interaction
  setTimeout(() => {
    element.style.transition = '';
  }, 60);
};

// Get print styles for text boxes
export const getPrintStyles = () => `
  @media print {
    .text-box-controls { display: none !important; }
    .text-box-component { border: none !important; }
  }
`;

// Convert percentage position to pixels
export const percentToPixels = (
  position: { x: number, y: number }, 
  containerWidth: number, 
  containerHeight: number
) => {
  const x = (position.x / 100) * containerWidth;
  const y = (position.y / 100) * containerHeight;
  
  return { x, y };
};

// Convert pixel position to percentage
export const pixelsToPercent = (
  position: { x: number, y: number }, 
  containerWidth: number, 
  containerHeight: number
) => {
  const x = (position.x / containerWidth) * 100;
  const y = (position.y / containerHeight) * 100;
  
  return { x, y };
};
