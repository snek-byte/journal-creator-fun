
import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { TextBoxComponent } from './TextBoxComponent';
import { StickerContainer } from './StickerContainer';
import { IconContainer } from './IconContainer';
import { DrawingLayer } from './DrawingLayer';
import { X } from 'lucide-react';
import type { Mood, Sticker, Icon, TextBox } from '@/types/journal';
import { formatJournalText } from '@/utils/formattedTextUtils';

interface JournalPreviewProps {
  showPreview: boolean;
  text: string;
  mood?: Mood;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle?: string;
  stickers: Sticker[];
  icons: Icon[];
  textBoxes: TextBox[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  onStickerAdd: (sticker: Sticker) => void;
  onIconAdd: (icon: Icon) => void;
  onStickerMove: (id: string, position: { x: number; y: number }) => void;
  onIconMove: (id: string, position: { x: number; y: number }) => void;
  onIconUpdate: (id: string, updates: Partial<Icon>) => void;
  onIconSelect: (id: string | null) => void;
  onStickerSelect: (id: string | null) => void;
  onTextBoxAdd: (textBox: TextBox) => void;
  onTextBoxUpdate: (id: string, updates: Partial<TextBox>) => void;
  onTextBoxRemove: (id: string) => void;
  onTextBoxSelect: (id: string | null) => void;
  onTextMove: (position: { x: number; y: number }) => void;
  onTextDragStart: () => void;
  onTextDragEnd: () => void;
  onBackgroundSelect: (url: string) => void;
  onDrawingChange: (drawing: string) => void;
  onFilterChange: (filter: string) => void;
  onTogglePreview: () => void;
  drawingTool: string;
  drawingColor: string;
  brushSize: number;
  isDrawingMode: boolean;
}

export function JournalPreview({
  showPreview,
  text,
  mood,
  font,
  fontSize,
  fontWeight,
  fontColor,
  gradient,
  textStyle,
  stickers,
  icons,
  textBoxes,
  textPosition,
  backgroundImage,
  drawing,
  filter,
  onStickerAdd,
  onIconAdd,
  onStickerMove,
  onIconMove,
  onIconUpdate,
  onIconSelect,
  onStickerSelect,
  onTextBoxAdd,
  onTextBoxUpdate,
  onTextBoxRemove,
  onTextBoxSelect,
  onTextMove,
  onTextDragStart,
  onTextDragEnd,
  onBackgroundSelect,
  onDrawingChange,
  onFilterChange,
  onTogglePreview,
  drawingTool,
  drawingColor,
  brushSize,
  isDrawingMode
}: JournalPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTextBeingDragged, setIsTextBeingDragged] = useState(false);
  const [selectedTextBoxId, setSelectedTextBoxId] = useState<string | null>(null);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const calculateTextStyle = () => {
    switch (textStyle) {
      case 'bold':
        return 'font-bold';
      case 'italic':
        return 'italic';
      case 'underline':
        return 'underline';
      default:
        return 'normal';
    }
  };

  const handleTextPointerDown = () => {
    setIsTextBeingDragged(true);
    onTextDragStart();
  };

  const handleTextPointerUp = () => {
    setIsTextBeingDragged(false);
    onTextDragEnd();
  };

  const handleTextPointerMove = (e: React.PointerEvent) => {
    if (!isTextBeingDragged || !containerRef.current) return;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const y = e.clientY - containerRect.top;

    const newX = Math.max(0, Math.min(x, containerRect.width));
    const newY = Math.max(0, Math.min(y, containerRect.height));

    onTextMove({ x: newX, y: newY });
  };

  const calculateFilterStyle = () => {
    switch (filter) {
      case 'sepia':
        return 'sepia(100%)';
      case 'grayscale':
        return 'grayscale(100%)';
      case 'blur':
        return 'blur(3px)';
      case 'brightness':
        return 'brightness(150%)';
      case 'contrast':
        return 'contrast(200%)';
      case 'hue-rotate':
        return 'hue-rotate(90deg)';
      case 'invert':
        return 'invert(80%)';
      case 'saturate':
        return 'saturate(200%)';
      default:
        return 'none';
    }
  };

  const handleDeleteByMovingOffscreen = (id: string, isIcon: boolean) => {
    const offscreenPosition = { 
      x: -1000, 
      y: -1000 
    };
    
    if (isIcon) {
      onIconMove(id, offscreenPosition);
      
      const iconUpdates: Partial<Icon> = {
        size: 0
      };
      onIconUpdate(id, iconUpdates);
    } else {
      onStickerMove(id, offscreenPosition);
    }
  };

  // Render a minimal fallback if showPreview is false
  if (!showPreview) {
    return null;
  }

  return (
    <div className="flex-1 w-full flex flex-col justify-center items-center p-4 overflow-hidden relative bg-gray-100">
      <div
        ref={containerRef}
        className="relative w-full max-w-2xl aspect-[3/4] mx-auto rounded-md overflow-hidden shadow-lg"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: !backgroundImage ? '#ffffff' : 'transparent',
          filter: calculateFilterStyle()
        }}
      >
        <DrawingLayer 
          onDrawingChange={onDrawingChange}
          initialDrawing={drawing}
          tool={drawingTool}
          color={drawingColor}
          brushSize={brushSize}
          isDrawingMode={isDrawingMode}
        />
        
        {textBoxes.map((textBox) => (
          <TextBoxComponent
            key={textBox.id}
            textBox={textBox}
            selected={textBox.id === selectedTextBoxId}
            containerRef={containerRef}
            onUpdate={(updates) => onTextBoxUpdate(textBox.id, updates)}
            onRemove={() => onTextBoxRemove(textBox.id)}
            onSelect={() => onTextBoxSelect(textBox.id)}
            isDrawingMode={isDrawingMode}
          />
        ))}
        
        {stickers.map((sticker) => (
          <StickerContainer
            key={sticker.id}
            sticker={sticker}
            selected={sticker.id === selectedStickerId}
            containerRef={containerRef}
            onMove={(position) => onStickerMove(sticker.id, position)}
            onSelect={() => onStickerSelect(sticker.id)}
          />
        ))}
        
        {icons.map((icon) => (
          <IconContainer
            key={icon.id}
            icon={icon}
            selected={icon.id === selectedIconId}
            containerRef={containerRef}
            onMove={(position) => onIconMove(icon.id, position)}
            onUpdate={(updates) => onIconUpdate(icon.id, updates)}
            onSelect={() => onIconSelect(icon.id)}
          />
        ))}
        
        <div
          className="absolute"
          style={{
            top: `${textPosition.y}px`,
            left: `${textPosition.x}px`,
            fontFamily: font,
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: fontColor,
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'grab',
            userSelect: 'none',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: '1.4',
            maxWidth: '80%',
            textAlign: 'center',
            ...(textStyle ? { fontStyle: textStyle.includes('italic') ? 'italic' : 'normal' } : {}),
            ...(textStyle ? { textDecoration: textStyle.includes('underline') ? 'underline' : 'none' } : {})
          }}
          draggable
          onPointerDown={handleTextPointerDown}
          onPointerUp={handleTextPointerUp}
          onPointerMove={handleTextPointerMove}
        >
          {text}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-2 left-2 h-8 w-8 bg-white"
          onClick={onTogglePreview}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
