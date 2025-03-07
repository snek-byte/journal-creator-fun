
import React from 'react';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { getTextStyles } from '@/utils/textBoxUtils';

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
  if (isEditing) {
    return (
      <textarea
        className="w-full h-full p-2 border focus:outline-none focus:ring-2 focus:ring-primary"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <div
      style={getTextStyles(
        textBox.font,
        textBox.fontSize,
        textBox.fontWeight,
        textBox.fontColor,
        textBox.gradient,
        textBox.textStyle,
        textBox.rotation || 0
      )}
    >
      {textBox.textStyle && !textBox.textStyle.startsWith('wordart:') ?
        applyTextStyle(textBox.text, textBox.textStyle as TextStyle) :
        textBox.text
      }
    </div>
  );
}
