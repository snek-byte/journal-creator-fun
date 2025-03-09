
import React, { useState, useRef, useEffect } from 'react';
import { TextBox } from '@/types/journal';
import { TextBoxContent } from './TextBoxContent';

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
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [justCreated, setJustCreated] = useState(
    textBox.text === 'Double-click to edit this text box'
  );

  useEffect(() => {
    setText(textBox.text);
    
    if (textBox.text === 'Double-click to edit this text box') {
      setJustCreated(true);
    }
  }, [textBox.text]);

  useEffect(() => {
    if (justCreated && selected) {
      setIsEditing(true);
      setJustCreated(false);
    }
  }, [justCreated, selected]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isDrawingMode && !isDragging) {
      e.stopPropagation();
      onSelect(textBox.id);
      
      if (!isEditing && selected) {
        setIsEditing(true);
        
        // Clear placeholder text when editing begins
        if (text === 'Double-click to edit this text box') {
          setText('');
        }
      }
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
    if (e.key === 'Enter' && !e.shiftKey) {
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
    setStartPos({
      x: e.clientX,
      y: e.clientY
    });
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    console.log("MouseDown on textbox:", textBox.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const deltaXPercent = (deltaX / containerWidth) * 100;
    const deltaYPercent = (deltaY / containerHeight) * 100;
    
    const newX = Math.max(0, Math.min(100, textBox.position.x + deltaXPercent));
    const newY = Math.max(0, Math.min(100, textBox.position.y + deltaYPercent));
    
    onUpdate(textBox.id, { 
      position: { x: newX, y: newY }
    });
    
    setStartPos({
      x: e.clientX,
      y: e.clientY
    });

    console.log("Moving textbox:", textBox.id, "to", newX, newY);
  };
  
  const handleMouseUp = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      
      setIsDragging(false);
      
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      console.log("Drag ended for textbox:", textBox.id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDrawingMode || isEditing) return;
    
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    
    onSelect(textBox.id);
    setIsDragging(true);
    
    const touch = e.touches[0];
    setStartPos({
      x: touch.clientX,
      y: touch.clientY
    });
    
    console.log("TouchStart on textbox:", textBox.id);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    
    const deltaXPercent = (deltaX / containerWidth) * 100;
    const deltaYPercent = (deltaY / containerHeight) * 100;
    
    const newX = Math.max(0, Math.min(100, textBox.position.x + deltaXPercent));
    const newY = Math.max(0, Math.min(100, textBox.position.y + deltaYPercent));
    
    onUpdate(textBox.id, { 
      position: { x: newX, y: newY }
    });
    
    setStartPos({
      x: touch.clientX,
      y: touch.clientY
    });

    console.log("Touch moving textbox:", textBox.id, "to", newX, newY);
  };
  
  const handleTouchEnd = (e: TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      setIsDragging(false);
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      console.log("Touch drag ended for textbox:", textBox.id);
    }
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging]);
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        height: 'auto',
        zIndex: selected ? 100 : (textBox.zIndex || 10),
        ...style,
        pointerEvents: isDrawingMode ? 'none' : 'auto',
        touchAction: 'none',
        userSelect: 'none'
      }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      draggable="false"
    >
      <div 
        className={`w-full h-full p-2 flex items-center justify-center rounded transition-all duration-150 
          ${selected && !isEditing ? 'ring-2 ring-primary ring-offset-2' : ''}
          ${isDragging ? 'opacity-80 scale-105' : 'opacity-100'}
        `}
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
          className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg z-20"
          onClick={handleDelete}
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
