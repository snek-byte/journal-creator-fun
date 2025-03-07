
// Import necessary dependencies
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
  stepX: number = 5,
  stepY: number = 5
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
  posY += (textBoxes.length % 7) * stepY;
  
  // Ensure within bounds
  posX = Math.max(15, Math.min(85, posX));
  posY = Math.max(15, Math.min(85, posY));
  
  return { x: posX, y: posY };
};
