
import React from 'react';

interface TextBoxContentProps {
  isEditing: boolean;
  editValue: string;
  text: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle?: string;
  rotation?: number;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  isPrinting: boolean;
  style?: React.CSSProperties;
}

export function TextBoxContent({
  isEditing,
  editValue,
  text,
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  textStyle,
  onTextChange,
  onBlur,
  onKeyDown,
  textAreaRef,
  isPrinting,
  style
}: TextBoxContentProps) {
  const usingGradient = gradient && gradient !== '';
  
  const textStyles: React.CSSProperties = {
    ...style,
    fontFamily: font || 'sans-serif',
    fontSize: fontSize || '16px',
    fontWeight: fontWeight as any || 'normal',
    padding: '1.5rem 0.5rem 0.5rem 0.5rem', // Increased top padding to accommodate drag handle
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
      textStyles.fontStyle = 'italic';
    }
    
    if (textStyle.includes('underline')) {
      textStyles.textDecoration = 'underline';
    }
  }
  
  // Handle gradient or solid color
  if (usingGradient) {
    textStyles.background = gradient;
    textStyles.WebkitBackgroundClip = 'text';
    textStyles.WebkitTextFillColor = 'transparent';
    textStyles.backgroundClip = 'text';
    textStyles.color = 'transparent';
  } else {
    textStyles.color = fontColor || '#000000';
  }
  
  if (isPrinting) {
    return (
      <div className="print-content" style={textStyles}>
        {text}
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <textarea
        ref={textAreaRef}
        value={editValue}
        onChange={onTextChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="focus-visible:outline-none no-drag"
        style={textStyles}
        placeholder="Type here..."
        autoFocus
      />
    );
  }
  
  return (
    <div className="text-content" style={textStyles}>
      {text || "Double-click to edit"}
    </div>
  );
}
