
import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Move, Check } from 'lucide-react';
import { TextBox } from '@/types/journal';
import { applyTextStyle, TextStyle } from '@/utils/unicodeTextStyles';
import { TextBoxContent } from './TextBoxContent';
import { TextBoxControls } from './TextBoxControls';

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
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
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
      
      onUpdate(textBox.id, { position: { x: newX, y: newY } });
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
    
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
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
      
      onUpdate(textBox.id, { position: { x: newX, y: newY } });
    };
    
    const handleTouchEnd = () => {
      setIsDragging(false);
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const getWordArtStyle = (textStyleValue: string): React.CSSProperties => {
    if (!textStyleValue?.startsWith('wordart:')) return {};
    
    const wordArtStyle = textStyleValue.split(':')[1];
    const styles: React.CSSProperties = {};
    
    switch (wordArtStyle) {
      case 'rainbow':
        styles.background = 'linear-gradient(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF)';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.backgroundClip = 'text';
        styles.fontWeight = '800';
        styles.letterSpacing = '0.05em';
        styles.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.2)';
        break;
      case 'neon':
        styles.color = '#4ade80';
        styles.fontWeight = '800';
        styles.letterSpacing = '0.1em';
        styles.textShadow = '0 0 5px #4ade80, 0 0 10px #4ade80, 0 0 15px #4ade80, 0 0 20px #4ade80';
        break;
      case 'shadow':
        styles.color = 'white';
        styles.fontWeight = '700';
        styles.textShadow = '2px 2px 0 #333, 3px 3px 0 #555';
        break;
      case 'outlined':
        styles.color = 'transparent';
        styles.fontWeight = '800';
        styles.WebkitTextStroke = '1.5px black';
        break;
      case 'retro':
        styles.color = '#f59e0b';
        styles.fontWeight = '700';
        styles.letterSpacing = '0.05em';
        styles.textShadow = '1px 1px 0 #78350f, 2px 2px 0 #78350f';
        styles.borderBottom = '3px solid #78350f';
        break;
      case 'metallic':
        styles.backgroundImage = 'linear-gradient(180deg, #FFFFFF, #E8E8E8, #B0B0B0, #707070, #B0B0B0, #E8E8E8, #FFFFFF)';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.backgroundClip = 'text';
        styles.fontWeight = '800';
        styles.letterSpacing = '0.02em';
        styles.textShadow = '0px 1px 2px rgba(0, 0, 0, 0.4)';
        styles.filter = 'drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.3))';
        break;
      case 'golden':
        styles.background = 'linear-gradient(to bottom, #E6B800, #FFC926, #E6B800, #D4AF37, #B8860B, #D4AF37)';
        styles.backgroundClip = 'text';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.fontWeight = '800';
        styles.textShadow = '0px 1px 1px rgba(255,255,255,0.3), 0px 2px 3px rgba(120, 80, 0, 0.5)';
        styles.filter = 'drop-shadow(1px 2px 2px rgba(160, 120, 0, 0.6))';
        break;
      case 'bubble':
        styles.color = '#60a5fa';
        styles.fontWeight = '800';
        styles.textShadow = '0 1px 0 #2563eb, 0 2px 0 #1d4ed8, 0 3px 0 #1e40af, 0 4px 0 #1e3a8a';
        styles.letterSpacing = '0.05em';
        break;
    }
    
    return styles;
  };

  return (
    <div
      ref={textBoxRef}
      className={`absolute ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: `${textBox.position.x}%`,
        top: `${textBox.position.y}%`,
        transform: `translate(-50%, -50%) rotate(${textBox.rotation}deg)`,
        width: textBox.width,
        height: textBox.height,
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
        <div 
          className={`w-full h-full overflow-hidden whitespace-pre-wrap`}
          style={{
            fontFamily: textBox.font,
            fontSize: textBox.fontSize,
            fontWeight: textBox.fontWeight,
            color: textBox.gradient ? 'transparent' : textBox.fontColor,
            background: textBox.gradient || 'transparent',
            WebkitBackgroundClip: textBox.gradient ? 'text' : 'border-box',
            backgroundClip: textBox.gradient ? 'text' : 'border-box',
            ...getWordArtStyle(textBox.textStyle)
          }}
        >
          {textBox.textStyle && !textBox.textStyle.startsWith('wordart:') ?
            applyTextStyle(textBox.text, textBox.textStyle as TextStyle) :
            textBox.text
          }
        </div>
      </div>

      {selected && (
        <TextBoxControls
          textBox={textBox}
          onRemove={onRemove}
          onUpdate={onUpdate}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          text={text}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
}
