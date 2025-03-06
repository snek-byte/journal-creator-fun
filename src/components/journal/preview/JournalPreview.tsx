
import React, { useState, useEffect, useRef } from 'react';
import { GripVertical, X, Trash, Image, Check, PenTool, Undo, Redo, Plus } from 'lucide-react';
import type { JournalEntry, Sticker, Icon, TextBox } from '@/types/journal';
import { StickerContainer } from '../StickerContainer';
import { IconContainer } from '../IconContainer';
import { TextBoxComponent } from '../TextBoxComponent';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DrawingLayer } from '../DrawingLayer';
import { MainTextDisplay } from './MainTextDisplay';
import { PreviewControls } from './PreviewControls';
import { useJournalTextPosition } from '@/hooks/useJournalTextPosition';

interface JournalPreviewProps {
  text: string;
  mood?: string;
  font: string;
  fontSize: string;
  fontWeight: string;
  fontColor: string;
  gradient: string;
  textStyle: string;
  stickers: Sticker[];
  icons: Icon[];
  textBoxes: TextBox[];
  textPosition: { x: number; y: number };
  backgroundImage?: string;
  drawing?: string;
  filter?: string;
  audio?: any;
  onStickerAdd?: (sticker: Sticker) => void;
  onIconAdd?: (icon: Icon) => void;
  onStickerMove?: (id: string, position: { x: number; y: number }) => void;
  onIconMove?: (id: string, position: { x: number; y: number }) => void;
  onIconUpdate?: (id: string, updates: Partial<Icon>) => void;
  onIconSelect?: (id: string | null) => void;
  onTextBoxAdd?: (textBox: TextBox) => void;
  onTextBoxUpdate?: (id: string, updates: Partial<TextBox>) => void;
  onTextBoxRemove?: (id: string) => void;
  onTextBoxSelect?: (id: string | null) => void;
  onTextMove?: (position: { x: number; y: number }) => void;
  onTextDragStart?: () => void;
  onTextDragEnd?: () => void;
  onBackgroundSelect?: (url: string) => void;
  onDrawingChange?: (drawing: string) => void;
  onFilterChange?: (filter: string) => void;
  onTogglePreview?: () => void;
  drawingTool?: string;
  drawingColor?: string;
  brushSize?: number;
  isDrawingMode?: boolean;
  onDrawingModeToggle?: (enabled: boolean) => void;
  onStickerSelect?: (id: string | null) => void;
  selectedStickerId?: string | null;
  selectedIconId?: string | null;
  selectedTextBoxId?: string | null;
}

export function JournalPreview({
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
  audio,
  onStickerAdd,
  onIconAdd,
  onStickerMove,
  onIconMove,
  onIconUpdate,
  onIconSelect,
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
  isDrawingMode = false,
  onDrawingModeToggle,
  onStickerSelect,
  selectedStickerId,
  selectedIconId,
  selectedTextBoxId
}: JournalPreviewProps) {
  const [undoAvailable, setUndoAvailable] = useState(false);
  const [redoAvailable, setRedoAvailable] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the new hook for text position
  const { 
    position, 
    isDragging, 
    handleDragStart 
  } = useJournalTextPosition({
    initialPosition: textPosition || { x: 50, y: 50 },
    containerRef,
    onTextMove,
    onTextDragStart,
    onTextDragEnd
  });

  useEffect(() => {
    if (drawing) {
      setUndoAvailable(true);
      setRedoAvailable(false);
    }
  }, [drawing]);

  const handleStickerSelect = (stickerId: string) => {
    if (onStickerSelect) {
      onStickerSelect(stickerId === selectedStickerId ? null : stickerId);
    }
    if (onIconSelect) {
      onIconSelect(null);
    }
    if (onTextBoxSelect) {
      onTextBoxSelect(null);
    }
  };

  const handleIconSelect = (iconId: string) => {
    if (onIconSelect) {
      onIconSelect(iconId === selectedIconId ? null : iconId);
    }
    if (onStickerSelect) {
      onStickerSelect(null);
    }
    if (onTextBoxSelect) {
      onTextBoxSelect(null);
    }
  };
  
  const handleTextBoxSelect = (id: string | null) => {
    if (onTextBoxSelect) {
      onTextBoxSelect(id);
    }
    if (onIconSelect) {
      onIconSelect(null);
    }
    if (onStickerSelect) {
      onStickerSelect(null);
    }
  };

  const getBackgroundStyling = () => {
    if (backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      };
    }
    return {};
  };

  const applyFilter = () => {
    if (filter && filter !== 'none') {
      return `filter ${filter}`;
    }
    return '';
  };

  return (
    <div className="relative h-full overflow-hidden bg-white" id="journal-preview" ref={containerRef}>
      <div 
        className={cn(
          "relative w-full h-full overflow-hidden", 
          applyFilter()
        )}
        style={getBackgroundStyling()}
      >
        {/* Drawing Layer */}
        {onDrawingChange && (
          <DrawingLayer 
            isDrawingMode={isDrawingMode}
            initialDrawing={drawing}
            onDrawingChange={onDrawingChange}
            tool={drawingTool}
            color={drawingColor}
            brushSize={brushSize}
          />
        )}
        
        {/* Main Journal Text */}
        {text && !textBoxes?.some(box => box.text === text) && (
          <MainTextDisplay
            text={text}
            textPosition={textPosition}
            font={font}
            fontSize={fontSize}
            fontWeight={fontWeight}
            fontColor={fontColor}
            gradient={gradient}
            textStyle={textStyle}
            isDrawingMode={!!isDrawingMode}
            onMouseDown={handleDragStart}
            onMouseMove={() => {}}
            onMouseUp={() => {}}
          />
        )}
        
        {/* Stickers Layer */}
        {stickers?.map(sticker => (
          <StickerContainer
            key={sticker.id}
            sticker={sticker}
            selected={sticker.id === selectedStickerId}
            onSelect={() => handleStickerSelect(sticker.id)}
            onMove={(id, position) => {
              if (onStickerMove) {
                onStickerMove(id, position);
              }
            }}
            containerRef={containerRef}
          />
        ))}
        
        {/* Icons Layer */}
        {icons?.map(icon => (
          <IconContainer
            key={icon.id}
            icon={icon}
            selected={icon.id === selectedIconId}
            onSelect={() => handleIconSelect(icon.id)}
            onMove={(id, position) => {
              if (onIconMove) {
                onIconMove(id, position);
              }
            }}
            onUpdate={(id, updates) => {
              if (onIconUpdate) {
                onIconUpdate(id, updates);
              }
            }}
            containerRef={containerRef}
          />
        ))}
        
        {/* Text Boxes Layer */}
        {textBoxes?.map((textBox) => (
          <TextBoxComponent
            key={textBox.id}
            textBox={textBox}
            selected={textBox.id === selectedTextBoxId}
            onSelect={() => handleTextBoxSelect(textBox.id)}
            onRemove={() => {
              if (onTextBoxRemove) {
                onTextBoxRemove(textBox.id);
              }
            }}
            onUpdate={(updates) => {
              if (onTextBoxUpdate) {
                onTextBoxUpdate(textBox.id, updates);
              }
            }}
            containerRef={containerRef}
            isDrawingMode={isDrawingMode}
          />
        ))}
      </div>
      
      {/* Overlay Controls */}
      {onDrawingModeToggle && (
        <PreviewControls 
          isDrawingMode={!!isDrawingMode} 
          onDrawingModeToggle={onDrawingModeToggle} 
          onCreateTextBox={
            onTextBoxSelect && onTextBoxAdd 
              ? () => handleTextBoxSelect(null) // Deselect any selected text box first
              : undefined
          }
        />
      )}
    </div>
  );
}
