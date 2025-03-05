
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

  [draggable="true"] {
    cursor: move;
  }

  .resizable {
    overflow: scroll;
    resize: both;
    max-width: 300px;
    max-height: 460px;
    border: 1px solid black;
    min-width: 50px;
    min-height: 50px;
    background-color: skyblue;
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

// Function to initialize Bootstrap in the app
export const initializeBootstrap = () => {
  if (typeof window !== 'undefined') {
    // Optionally load UI resources if needed for draggable functionality
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/ui/1.13.2/jquery-ui.min.js';
    script.async = true;
    document.body.appendChild(script);
    
    // Load Bootstrap styles if not already loaded
    if (!document.querySelector('link[href*="bootstrap"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      document.head.appendChild(link);
    }
  }
};
