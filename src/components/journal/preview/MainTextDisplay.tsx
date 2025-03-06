
import React from 'react';
import { cn } from '@/lib/utils';
import { renderUnicodeText, getTextStyle, getGradientStyle } from '@/utils/formattedTextUtils';

interface MainTextDisplayProps {
  text: string;
  textPosition: { x: number; y: number };
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle: string;
  isDrawingMode: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
}

export function MainTextDisplay({
  text,
  textPosition,
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  textStyle,
  isDrawingMode,
  onMouseDown,
  onMouseMove,
  onMouseUp
}: MainTextDisplayProps) {
  if (!text) return null;
  
  return (
    <div
      className={cn(
        "absolute p-4 cursor-move",
        "transition-opacity duration-300",
        isDrawingMode ? "opacity-50" : "opacity-100",
        "max-w-[60%] break-words"
      )}
      style={{
        left: `${textPosition.x}%`,
        top: `${textPosition.y}%`,
        transform: 'translate(-50%, -50%)',
        fontFamily: font || 'sans-serif',
        fontSize: fontSize || '16px',
        fontWeight: fontWeight || 'normal',
        color: fontColor || 'black',
        background: gradient ? 'transparent' : 'transparent',
        backgroundImage: gradient || 'none',
        WebkitBackgroundClip: gradient ? 'text' : 'unset',
        WebkitTextFillColor: gradient ? 'transparent' : 'unset',
        ...getTextStyle(textStyle || '')
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      dangerouslySetInnerHTML={{ 
        __html: renderUnicodeText(text, textStyle || '')
          .replace(/\n/g, '<br>')
          .replace(/(^|\s)(#[^\s#]+)/g, '$1<span style="color:#3b82f6">$2</span>')
      }}
    ></div>
  );
}
