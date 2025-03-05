
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

  // Add Bootstrap drag behavior
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Skip if we're in editing mode or printing
    if (isEditing || isPrinting || !contentRef.current) return;
    
    // Initialize Bootstrap draggable functionality
    try {
      if (window.jQuery && typeof window.jQuery.fn.draggable === 'function') {
        const $element = window.jQuery(contentRef.current.parentElement);
        
        // Clean up any previous instance
        if ($element.data('ui-draggable')) {
          $element.draggable('destroy');
        }
        
        // Initialize draggable
        $element.draggable({
          handle: ".drag-handle",
          cursor: "grabbing",
          scroll: false,
          containment: "parent"
        });
      }
    } catch (err) {
      console.error("Error initializing Bootstrap draggable:", err);
    }
    
    return () => {
      // Cleanup on unmount
      try {
        if (window.jQuery && contentRef.current) {
          const $element = window.jQuery(contentRef.current.parentElement);
          if ($element.data('ui-draggable')) {
            $element.draggable('destroy');
          }
        }
      } catch (err) {
        console.error("Error cleaning up Bootstrap draggable:", err);
      }
    };
  }, [isEditing, isPrinting]);

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

// Declare jQuery for TypeScript
declare global {
  interface Window {
    jQuery: any;
  }
}
