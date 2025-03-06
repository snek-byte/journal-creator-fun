
import React, { useEffect, useRef } from 'react';
import type { Frame } from '@/types/meme';

interface MemeCanvasProps {
  frame: Frame;
  topText: string;
  bottomText: string;
  textColor: string;
  fontSize: number;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fontFamily?: string;
  strokeWidth?: number;
  strokeColor?: string;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({
  frame,
  topText,
  bottomText,
  fontFamily = 'Impact',
  fontSize,
  strokeWidth = 2,
  textColor,
  strokeColor = '#000000',
  canvasRef,
}) => {
  useEffect(() => {
    if (!canvasRef.current || !frame) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = frame.src;

    img.onload = () => {
      // Set canvas dimensions to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Clear canvas and draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Configure text style
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.textAlign = 'center';
      
      // Draw top text
      if (topText) {
        drawTextWithLineBreaks(ctx, topText, canvas.width / 2, fontSize + 10, fontSize, canvas.width * 0.8);
      }
      
      // Draw bottom text
      if (bottomText) {
        drawTextWithLineBreaks(ctx, bottomText, canvas.width / 2, canvas.height - 20, fontSize, canvas.width * 0.8);
      }
    };
  }, [frame, topText, bottomText, fontSize, textColor, strokeWidth, strokeColor, fontFamily, canvasRef]);

  const drawTextWithLineBreaks = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    maxWidth: number
  ) => {
    const words = text.split(' ');
    let line = '';
    const lineHeight = fontSize * 1.2;
    let currentY = y;
    
    // For bottom text, we need to know total height first to position correctly
    const isBottomText = y > ctx.canvas.height / 2;
    if (isBottomText) {
      const lines = [];
      let testLine = '';
      
      for (const word of words) {
        const testWidth = ctx.measureText(testLine + word + ' ').width;
        if (testWidth > maxWidth && testLine !== '') {
          lines.push(testLine);
          testLine = word + ' ';
        } else {
          testLine += word + ' ';
        }
      }
      
      if (testLine !== '') {
        lines.push(testLine);
      }
      
      // Adjust starting Y for bottom text
      currentY -= lineHeight * (lines.length - 1);
    }
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && line !== '') {
        ctx.strokeText(line, x, currentY);
        ctx.fillText(line, x, currentY);
        line = word + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    
    ctx.strokeText(line, x, currentY);
    ctx.fillText(line, x, currentY);
  };

  return (
    <canvas 
      ref={canvasRef} 
      className="max-w-full h-auto border rounded-md shadow-md"
    />
  );
};
