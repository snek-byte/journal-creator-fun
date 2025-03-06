
import React from 'react';

interface MemeCanvasPlaceholderProps {
  backgroundColor: string;
}

export function MemeCanvasPlaceholder({ backgroundColor }: MemeCanvasPlaceholderProps) {
  return (
    <>
      {/* Background color layer when no image */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: backgroundColor || '#ffffff' }}
      />

      {/* Placeholder if no image */}
      <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-10">
        <p className="text-gray-400 text-center p-4">Click to add your photo</p>
      </div>
    </>
  );
}
