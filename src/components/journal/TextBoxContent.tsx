
import React, { useEffect, useRef } from 'react';
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
  const mergedStyles: React.CSSProperties = {
    ...contentStyles,
    ...style,
    // Ensure these styles for proper interaction
    pointerEvents: isEditing ? 'auto' : 'none',
    userSelect: isEditing ? 'text' : 'none',
    width: '100%',
    height: '100%'
  };

  // Ref for drag handling
  const contentRef = useRef<HTMLDivElement>(null);

  if (isEditing) {
    return (
      <textarea
        ref={textAreaRef}
        value={editValue}
        onChange={onTextChange}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        style={mergedStyles}
        className="text-box-content-edit w-full h-full resize-none focus:outline-none p-2"
        placeholder="Enter text here..."
      />
    );
  }

  return (
    <div
      ref={contentRef}
      style={mergedStyles}
      className="text-box-content-view w-full h-full overflow-hidden"
      title={isPrinting ? undefined : "Double-click to edit"}
    >
      {text || 'Empty text box'}
    </div>
  );
}
