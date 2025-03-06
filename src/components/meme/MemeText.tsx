
import React from 'react';

interface MemeTextProps {
  text: string;
  position: 'top' | 'bottom';
  font: string;
  fontSize: number;
  fontColor: string;
  strokeColor: string;
  fontWeight: string;
  textStyle: string;
  gradient: string;
}

export function MemeText({
  text,
  position,
  font,
  fontSize,
  fontColor,
  strokeColor,
  fontWeight,
  textStyle,
  gradient
}: MemeTextProps) {
  const textStyle1 = {
    fontFamily: font,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight as any,
    color: fontColor,
    textStroke: `2px ${strokeColor}`,
    WebkitTextStroke: `2px ${strokeColor}`,
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    wordBreak: 'break-word' as const,
    padding: '0 10px',
    fontStyle: textStyle?.includes('italic') ? 'italic' : 'normal',
    textDecoration: textStyle?.includes('underline') ? 'underline' : 'none',
    background: gradient || 'transparent',
    WebkitBackgroundClip: gradient ? 'text' : 'border-box',
    WebkitTextFillColor: gradient ? 'transparent' : fontColor,
    backgroundClip: gradient ? 'text' : 'border-box'
  };

  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0 pt-4' : 'bottom-0 pb-4'} left-0 right-0 flex items-${position === 'top' ? 'start' : 'end'} justify-center z-40`}
      style={textStyle1}
    >
      {text}
    </div>
  );
}
