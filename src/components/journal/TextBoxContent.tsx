
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
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const isEmpty = text.trim() === '';
  
  // Hide placeholder when user starts typing or when text is not empty
  useEffect(() => {
    if (!isEmpty) {
      setShowPlaceholder(false);
    }
  }, [isEmpty]);
  
  const handleFocus = () => {
    setShowPlaceholder(false);
  };
  
  // Default placeholder text or empty if text exists
  const placeholderText = isEmpty && showPlaceholder ? 
    "Double-click to add text..." : 
    "";
  
  if (isEditing) {
    return (
      <textarea
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        autoFocus
        placeholder={placeholderText}
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
  
  // For empty text box, show placeholder if appropriate
  if (isEmpty) {
    return (
      <div className="text-muted-foreground text-sm italic">
        {showPlaceholder ? "Double-click to add text..." : ""}
      </div>
    );
  }
  
  // For non-empty textbox, just show the text
  return (
    <div className="w-full break-words whitespace-pre-wrap">
      {text}
    </div>
  );
}
