
import React, { useState, useRef, useEffect } from 'react';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { TextBoxContent } from './TextBoxContent';
import { getTextStyles } from '@/utils/textBoxUtils';

interface TextBoxComponentProps {
  textBox: TextBox;
  selected: boolean;
  containerRef: React.RefObject<HTMLElement>;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TextBox>) => void;
  onRemove: (id: string) => void;
  isDrawingMode: boolean;
  style?: React.CSSProperties;
}

export function TextBoxComponent({
  textBox,
  selected,
  containerRef,
  onSelect,
  onUpdate,
  onRemove,
  isDrawingMode,
  style = {}
}: TextBoxComponentProps) {
  const textBoxRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(textBox.text);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setText(textBox.text);
  }, [textBox.text]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDrawingMode) {
      e.stopPropagation();
      onSelect(textBox.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!isDrawingMode) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(textBox.id, { text });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDrawingMode || isEditing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    onSelect(textBox.id);
    setIsDragging(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const initialPosition = { ...textBox.position };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const deltaXPercent = (deltaX / containerWidth) * 100;
      const deltaYPercent = (deltaY / containerHeight) * 100;
      
      const newX = Math.max(10, Math.min(90, initialPosition.x + deltaXPercent));
      const newY = Math.max(10, Math.min(90, initialPosition.y + deltaYPercent));
      
      onUpdate(textBox.id, { 
        position: { x: newX, y: newY },
        zIndex: textBox.zIndex // Preserve zIndex during drag
      });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDrawingMode || isEditing) return;
    
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    
    onSelect(textBox.id);
    setIsDragging(true);
    
    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;
    
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const initialPosition = { ...textBox.position };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      if (e.touches.length !== 1) return;
      
      const touch = e.touches[0];
      
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;
      
      const deltaXPercent = (deltaX / containerWidth) * 100;
      const deltaYPercent = (deltaY / containerHeight) * 100;
      
      const newX = Math.max(10, Math.min(90, initialPosition.x + deltaXPercent));
      const newY = Math.max(10, Math.min(90, initialPosition.y + deltaYPercent));
      
      onUpdate(textBox.id, { 
        position: { x: newX, y: newY },
        zIndex: textBox.zIndex // Preserve zIndex during drag
      });
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };
  
  const handleDelete = () => {
    onRemove(textBox.id);
  };

  return (
    <div
      ref={textBoxRef}
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: `${textBox.position.x}%`,
        top: `${textBox.position.y}%`,
        transform: `translate(-50%, -50%) rotate(${textBox.rotation || 0}deg)`,
        width: textBox.width || 160,
        height: textBox.height || 80,
        zIndex: textBox.zIndex || 10,
        ...style,
        pointerEvents: isDrawingMode ? 'none' : 'auto',
        touchAction: 'none'
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onDoubleClick={handleDoubleClick}
    >
      <div 
        className={`w-full h-full p-2 flex items-center justify-center bg-transparent rounded ${
          selected && !isEditing ? 'border-2 border-dashed border-primary/70' : ''
        }`}
      >
        <TextBoxContent
          textBox={textBox}
          isEditing={isEditing}
          text={text}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleKeyDown={handleKeyDown}
        />
      </div>

      {selected && !isEditing && (
        <button
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-10"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          aria-label="Delete text box"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
}
