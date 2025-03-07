
// Import necessary dependencies
import React from 'react';
import { TextBox } from '@/types/journal';

// Function to generate a z-index for a new text box
export const getNextZIndex = (textBoxes: TextBox[]): number => {
  if (textBoxes.length === 0) return 10;
  
  const maxZIndex = Math.max(...textBoxes.map(box => box.zIndex || 10));
  return maxZIndex + 1;
};

// Function to bring a text box to the front
export const bringToFront = (id: string, textBoxes: TextBox[]): TextBox[] => {
  const maxZIndex = Math.max(...textBoxes.map(box => box.zIndex || 10));
  
  return textBoxes.map(box => {
    if (box.id === id) {
      return { ...box, zIndex: maxZIndex + 1 };
    }
    return box;
  });
};

// Function to get optimized position for a new text box
export const getOptimalPosition = (
  textBoxes: TextBox[], 
  defaultX: number = 50, 
  defaultY: number = 50,
  stepX: number = 20,
  stepY: number = 20
): { x: number, y: number } => {
  // If no text boxes, use default position
  if (textBoxes.length === 0) {
    return { x: defaultX, y: defaultY };
  }
  
  // Start with default position and adjust
  let posX = defaultX;
  let posY = defaultY;
  
  // Simple offset based on number of text boxes
  posX += (textBoxes.length % 5) * stepX;
  posY += (textBoxes.length % 3) * stepY;
  
  // Ensure within bounds
  posX = Math.max(20, Math.min(80, posX));
  posY = Math.max(20, Math.min(80, posY));
  
  return { x: posX, y: posY };
};

// Function to get text styles for a text box
export const getTextStyles = (
  font: string,
  fontSize: string,
  fontWeight: string,
  fontColor: string,
  gradient: string,
  textStyle: string,
  rotation: number
): React.CSSProperties => {
  const styles: React.CSSProperties = {
    fontFamily: font || 'inherit',
    fontSize: fontSize || 'inherit',
    fontWeight: fontWeight || 'inherit',
    color: gradient ? 'transparent' : fontColor || 'inherit',
    background: gradient || 'transparent',
    WebkitBackgroundClip: gradient ? 'text' : 'border-box',
    backgroundClip: gradient ? 'text' : 'border-box',
    transform: `rotate(${rotation}deg)`,
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Handle specialized WordArt styles
  if (textStyle?.startsWith('wordart:')) {
    const wordArtStyle = textStyle.split(':')[1];
    
    switch (wordArtStyle) {
      case 'rainbow':
        styles.background = 'linear-gradient(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.backgroundClip = 'text';
        styles.fontWeight = '800';
        styles.letterSpacing = '0.05em';
        styles.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.2)';
        break;
      case 'neon':
        styles.color = '#4ade80';
        styles.fontWeight = '800';
        styles.letterSpacing = '0.1em';
        styles.textShadow = '0 0 5px #4ade80, 0 0 10px #4ade80, 0 0 15px #4ade80, 0 0 20px #4ade80';
        break;
      case 'shadow':
        styles.color = 'white';
        styles.fontWeight = '700';
        styles.textShadow = '2px 2px 0 #333, 3px 3px 0 #555';
        break;
      case 'outlined':
        styles.color = 'transparent';
        styles.fontWeight = '800';
        styles.WebkitTextStroke = '1.5px black';
        break;
      case 'retro':
        styles.color = '#f59e0b';
        styles.fontWeight = '700';
        styles.letterSpacing = '0.05em';
        styles.textShadow = '1px 1px 0 #78350f, 2px 2px 0 #78350f';
        styles.borderBottom = '3px solid #78350f';
        break;
      case 'metallic':
        styles.backgroundImage = 'linear-gradient(180deg, #FFFFFF, #E8E8E8, #B0B0B0, #707070, #B0B0B0, #E8E8E8, #FFFFFF)';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.backgroundClip = 'text';
        styles.fontWeight = '800';
        styles.letterSpacing = '0.02em';
        styles.textShadow = '0px 1px 2px rgba(0, 0, 0, 0.4)';
        styles.filter = 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3))';
        break;
      case 'golden':
        styles.background = 'linear-gradient(to bottom, #B78628, #FCC201, #FDEB71, #FCC201, #B78628)';
        styles.backgroundClip = 'text';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.fontWeight = '800';
        styles.textShadow = '0px 1px 1px rgba(255,255,255,0.3), 0px 2px 3px rgba(120, 80, 0, 0.5)';
        styles.filter = 'drop-shadow(1px 2px 2px rgba(160, 120, 0, 0.6))';
        break;
      case 'bubble':
        styles.color = '#60a5fa';
        styles.fontWeight = '800';
        styles.textShadow = '0 1px 0 #2563eb, 0 2px 0 #1d4ed8, 0 3px 0 #1e40af, 0 4px 0 #1e3a8a';
        styles.letterSpacing = '0.05em';
        break;
    }
  }
  
  return styles;
};
