
import React, { useEffect, useRef } from 'react';

interface MemeCanvasProps {
  image: string;
  topText: string;
  bottomText: string;
  fontFamily: string;
  fontSize: number;
  strokeWidth: number;
  textColor: string;
  strokeColor: string;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  image,
  topText,
  bottomText,
  fontFamily,
  fontSize,
  strokeWidth,
  textColor,
  strokeColor,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Function to apply text stroke effect using CSS text-shadow
  const getTextShadow = (width: number, color: string) => {
    if (width <= 0) return 'none';
    
    // Create a text shadow in all directions to simulate stroke
    const shadows = [];
    for (let x = -width; x <= width; x++) {
      for (let y = -width; y <= width; y++) {
        if (x !== 0 || y !== 0) {
          shadows.push(`${x}px ${y}px 0 ${color}`);
        }
      }
    }
    return shadows.join(', ');
  };

  return (
    <div 
      ref={containerRef} 
      className="relative"
      style={{ display: 'inline-block', maxWidth: '100%' }}
    >
      <img
        ref={imageRef}
        src={image}
        alt="Meme"
        className="max-w-full h-auto"
        style={{ maxHeight: '70vh' }}
      />

      <div 
        className="absolute top-0 left-0 right-0 p-4 text-center"
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          color: textColor,
          textShadow: getTextShadow(strokeWidth, strokeColor),
          lineHeight: '1.2',
          textTransform: 'uppercase',
          WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth}px ${strokeColor}` : 'none'
        }}
      >
        {topText}
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 p-4 text-center"
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          fontWeight: 'bold',
          color: textColor,
          textShadow: getTextShadow(strokeWidth, strokeColor),
          lineHeight: '1.2',
          textTransform: 'uppercase',
          WebkitTextStroke: strokeWidth > 0 ? `${strokeWidth}px ${strokeColor}` : 'none'
        }}
      >
        {bottomText}
      </div>
    </div>
  );
};
