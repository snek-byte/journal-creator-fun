
import React, { useState, useEffect } from 'react';
import { TextBox } from '@/types/journal';

interface TextBoxContentProps {
  textBox: TextBox;
  isEditing: boolean;
  text: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleBlur: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export function TextBoxContent({ 
  textBox, 
  isEditing, 
  text, 
  handleChange, 
  handleBlur, 
  handleKeyDown 
}: TextBoxContentProps) {
  const isEmpty = text.trim() === '';
  
  // For editing mode, just show the textarea with no placeholder
  if (isEditing) {
    return (
      <textarea
        value={text === 'Double-click to edit this text box' ? '' : text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-full min-h-[60px] bg-transparent resize-none focus:outline-none"
        style={{
          fontFamily: textBox.font || 'inherit',
          fontSize: textBox.fontSize || 'inherit',
          fontWeight: textBox.fontWeight || 'inherit',
          color: textBox.gradient ? 'transparent' : textBox.fontColor || 'inherit',
          background: textBox.gradient || 'transparent',
          WebkitBackgroundClip: textBox.gradient ? 'text' : 'border-box',
          backgroundClip: textBox.gradient ? 'text' : 'border-box',
        }}
      />
    );
  }
  
  // For empty text box, show placeholder
  if (isEmpty) {
    return (
      <div className="text-muted-foreground text-sm italic">
        Click to add text...
      </div>
    );
  }
  
  // For non-empty textbox, show the text with proper styling
  return (
    <div 
      className="w-full break-words whitespace-pre-wrap"
      style={{
        fontFamily: textBox.font || 'inherit',
        fontSize: textBox.fontSize || 'inherit',
        fontWeight: textBox.fontWeight || 'inherit',
        color: textBox.gradient ? 'transparent' : textBox.fontColor || 'inherit',
        background: textBox.gradient || 'transparent',
        WebkitBackgroundClip: textBox.gradient ? 'text' : 'border-box',
        backgroundClip: textBox.gradient ? 'text' : 'border-box',
      }}
    >
      {text}
    </div>
  );
}
