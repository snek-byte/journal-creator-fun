
import React from 'react';
import { TextStyle } from '@/utils/unicodeTextStyles';
import { getTextStyles } from '@/utils/textBoxUtils';

export interface TextBoxContentProps {
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
  rotation,
  onTextChange,
  onBlur,
  onKeyDown,
  textAreaRef,
  isPrinting,
  style = {}
}: TextBoxContentProps) {
  // Get the base styles for the content
  const contentStyles = getTextStyles(
    font,
    fontSize,
    fontWeight,
    fontColor,
    gradient,
    textStyle,
    rotation
  );
  
  // Merge with any additional style props
  const mergedStyles = {
    ...contentStyles,
    ...style
  };

  if (isEditing) {
    return (
      <textarea
        ref={textAreaRef}
        value={editValue}
        onChange={onTextChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        style={mergedStyles}
        className="text-box-content-edit"
        placeholder="Enter text here..."
      />
    );
  }

  return (
    <div
      style={mergedStyles}
      className="text-box-content-view"
      title={isPrinting ? undefined : "Double-click to edit"}
    >
      {text || 'Empty text box'}
    </div>
  );
}
