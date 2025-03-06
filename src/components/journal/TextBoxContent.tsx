
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { getTextStyles } from '@/utils/textBoxUtils';

interface TextBoxContentProps {
  isEditing: boolean;
  editValue: string;
  text: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle: string;
  rotation: number;
  onTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  isPrinting: boolean;
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
  rotation,
  onTextChange,
  onBlur,
  onKeyDown,
  textAreaRef,
  isPrinting
}: TextBoxContentProps) {
  // Apply text style
  const processText = (text: string) => {
    if (!text) return '';
    
    if (textStyle && textStyle !== 'normal') {
      return applyTextStyle(text, textStyle as TextStyle);
    }
    
    return text;
  };

  const styles = getTextStyles(font, fontSize, fontWeight, fontColor, gradient, textStyle, rotation);
  
  // Display empty text for new boxes
  const displayText = isPrinting ? (text || '') : (processText(text || ''));
  
  return (
    <>
      {isEditing ? (
        // Edit mode - textarea
        <Textarea
          ref={textAreaRef}
          value={editValue}
          onChange={onTextChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          className="w-full h-full resize-none border-none focus-visible:ring-0 focus-visible:outline-none p-2"
          style={{ ...styles, border: 'none' }}
          autoFocus
          placeholder="Type here..."
        />
      ) : (
        // View mode - display text
        <div
          className="w-full h-full whitespace-pre-wrap overflow-hidden flex items-center justify-center"
        >
          <div style={styles}>
            {displayText || 'Click to edit'}
          </div>
        </div>
      )}
    </>
  );
}
