
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

  useEffect(() => {
    setText(textBox.text);
  }, [textBox.text]);

  const handleClick = () => {
    if (!isDrawingMode) {
      onSelect(textBox.id);
    }
  };

  const handleDoubleClick = () => {
    if (!isDrawingMode) {
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

  const getWordArtStyle = (textStyleValue: string): React.CSSProperties => {
    if (!textStyleValue?.startsWith('wordart:')) return {};
    
    const wordArtStyle = textStyleValue.split(':')[1];
    const styles: React.CSSProperties = {};
    
    switch (wordArtStyle) {
      case 'rainbow':
        styles.background = 'linear-gradient(to right, #6366f1, #ec4899, #ef4444)';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.backgroundClip = 'text';
        styles.fontWeight = '700';
        styles.letterSpacing = '0.05em';
        break;
      case 'neon':
        styles.color = '#4ade80';
        styles.fontWeight = '800';
        styles.letterSpacing = '0.1em';
        styles.textShadow = '0 0 5px #4ade80, 0 0 10px #4ade80';
        break;
      case 'shadow':
        styles.color = 'white';
        styles.fontWeight = '700';
        styles.textShadow = '2px 2px 0 #333';
        break;
      case 'outlined':
        styles.color = 'transparent';
        styles.fontWeight = '800';
        styles.WebkitTextStroke = '1px black';
        break;
      case 'retro':
        styles.color = '#f59e0b';
        styles.fontWeight = '700';
        styles.letterSpacing = '0.05em';
        styles.textShadow = '1px 1px 0 #78350f';
        break;
      case 'metallic':
        styles.color = '#d1d5db';
        styles.fontWeight = '700';
        styles.backgroundImage = 'linear-gradient(180deg, #f9fafb, #6b7280)';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.3)';
        break;
      case 'golden':
        styles.backgroundImage = 'linear-gradient(to bottom, #f59e0b, #b45309)';
        styles.WebkitBackgroundClip = 'text';
        styles.WebkitTextFillColor = 'transparent';
        styles.fontWeight = '700';
        styles.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.2)';
        break;
      case 'bubble':
        styles.color = '#60a5fa';
        styles.fontWeight = '800';
        styles.textShadow = '0 1px 0 #2563eb, 0 2px 0 #1d4ed8, 0 3px 0 #1e40af';
        styles.letterSpacing = '0.05em';
        break;
    }
    
    return styles;
  };

  return (
    <div
      ref={textBoxRef}
      className="absolute cursor-move"
      style={{
        left: `${textBox.position.x}%`,
        top: `${textBox.position.y}%`,
        transform: `translate(-50%, -50%) rotate(${textBox.rotation}deg)`,
        width: textBox.width,
        height: textBox.height,
        zIndex: textBox.zIndex || 10,
        ...style,
        pointerEvents: isDrawingMode ? 'none' : 'auto'
      }}
      onClick={handleClick}
      onMouseDown={handleClick}
      onTouchStart={handleClick}
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
          onDoubleClick={handleDoubleClick}
        >
          {/* Apply the text style transformation if it's a Unicode style, but skip for wordart */}
          {textBox.textStyle && !textBox.textStyle.startsWith('wordart:') ?
            applyTextStyle(textBox.text, textBox.textStyle as TextStyle) :
            textBox.text
          }
        </div>
      </div>

      {/* Only show controls when the text box is selected */}
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
